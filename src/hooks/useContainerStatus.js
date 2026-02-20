import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Manages container lifecycle via REST API.
 * States: idle -> starting -> running -> stopping -> stopped -> error
 *
 * Lab start is asynchronous on the server — the POST returns immediately
 * with { status: 'starting' }.  We poll /api/lab/status until the server
 * reports 'running' or 'failed'.
 */
export default function useContainerStatus(sessionId) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Poll /api/lab/status until lab becomes 'running' or 'failed'
  const startPolling = useCallback(() => {
    clearPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/lab/status?session=${sessionId}`);
        const data = await res.json();
        if (data.status === 'running') {
          clearPolling();
          setStatus('running');
          setError(null);
        } else if (data.status === 'failed') {
          clearPolling();
          setError(data.error || '실습 환경 시작에 실패했습니다.');
          setStatus('error');
        }
        // 'starting' -> keep polling
      } catch { /* ignore transient polling errors */ }
    }, 2000);
  }, [sessionId, clearPolling]);

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
        // Already running (e.g. from a previous session)
        setStatus('running');
      } else {
        // status === 'starting' — poll until ready
        startPolling();
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [sessionId, startPolling]);

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
    await new Promise((r) => setTimeout(r, 1000));
    await start();
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPolling();
  }, [clearPolling]);

  return { status, error, start, stop, restart };
}
