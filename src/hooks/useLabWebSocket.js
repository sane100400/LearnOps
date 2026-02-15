import { useEffect, useRef, useCallback } from 'react';

/**
 * Manages WebSocket connection to the terminal backend.
 * Connects xterm.js Terminal to Docker container PTY via WebSocket.
 */
export default function useLabWebSocket(terminal, sessionId, isRunning) {
  const wsRef = useRef(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!terminal || !isRunning || !sessionId) {
      disconnect();
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/terminal?session=${sessionId}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      terminal.clear();
      terminal.focus();
    };

    ws.onmessage = (event) => {
      terminal.write(event.data);
    };

    ws.onclose = () => {
      terminal.write('\r\n\x1b[33m[Connection closed]\x1b[0m\r\n');
    };

    ws.onerror = () => {
      terminal.write('\r\n\x1b[31m[WebSocket error]\x1b[0m\r\n');
    };

    // Terminal input -> WebSocket
    const onDataDispose = terminal.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });

    return () => {
      onDataDispose.dispose();
      ws.close();
      wsRef.current = null;
    };
  }, [terminal, sessionId, isRunning, disconnect]);

  return { disconnect };
}
