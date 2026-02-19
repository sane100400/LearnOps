import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Manages container lifecycle via REST API.
 * States: idle -> starting -> running -> stopping -> stopped
 */
export default function useContainerStatus(sessionId) {
  const [status, setStatus] = useState('idle'); // idle | starting | running | stopping | stopped | error
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/lab/status?session=${sessionId}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.status === 'running') {
        setStatus('running');
        setError(null);
        clearPolling();
      } else if (data.status === 'starting') {
        setStatus((prev) => (prev === 'stopping' ? prev : 'starting'));
      } else if (data.status === 'stopping') {
        setStatus('stopping');
      } else if (data.status === 'failed') {
        setError(data.error || '실습 환경 시작에 실패했습니다.');
        setStatus('error');
        clearPolling();
      } else if (data.status === 'stopped') {
        setStatus((prev) => (prev === 'stopping' ? 'stopped' : prev === 'running' ? 'stopped' : prev));
        clearPolling();
      }
    } catch {
      // ignore polling errors
    }
  }, [sessionId, clearPolling]);

  const startPolling = useCallback(() => {
    clearPolling();
    pollingRef.current = setInterval(() => {
      checkStatus();
    }, 1500);
  }, [checkStatus, clearPolling]);

  const start = useCallback(async () => {
    setStatus('starting');
    setError(null);
    try {
      const res = await fetch(`/api/lab/start?session=${sessionId}`, { method: 'POST' });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch {
        throw new Error(`서버 응답 오류 (${res.status}). 백엔드 서버가 실행 중인지 확인하세요: npm run dev:server`);
      }
      if (!res.ok) throw new Error(data.error || 'Failed to start');

      if (data.status === 'running') {
        setStatus('running');
        clearPolling();
        return;
      }
      if (data.status === 'failed') {
        throw new Error(data.error || 'Failed to start');
      }

      setStatus('starting');
      await checkStatus();
      startPolling();
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [sessionId, checkStatus, startPolling, clearPolling]);

  const stop = useCallback(async () => {
    setStatus('stopping');
    setError(null);
    clearPolling();
    try {
      const res = await fetch(`/api/lab/stop?session=${sessionId}`, { method: 'POST' });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch {
        throw new Error(`서버 응답 오류 (${res.status}).`);
      }
      if (!res.ok) throw new Error(data.error || 'Failed to stop');
      setStatus('stopped');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [sessionId, clearPolling]);

  const restart = useCallback(async () => {
    await stop();
    // Small delay to let containers fully clean up
    await new Promise((r) => setTimeout(r, 1000));
    await start();
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  return { status, error, start, stop, restart, checkStatus };
}
