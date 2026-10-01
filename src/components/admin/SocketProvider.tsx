'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from '@/lib/socketEvents';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export function useSocket() {
  return useContext(SocketContext);
}

/**
 * Custom hook that safely subscribes to a Socket.IO event.
 * Handles cleanup and prevents duplicate listeners across React re-renders.
 */
export function useSocketEvent(event: string, handler: (data: any) => void) {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);

  // Always keep latest handler reference without re-subscribing
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const listener = (data: any) => {
      handlerRef.current(data);
    };

    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]); // Only re-subscribe if socket instance or event name changes
}

interface SocketProviderProps {
  children: React.ReactNode;
  sessionToken: string;
}

export function SocketProvider({ children, sessionToken }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionToken) return;

    // Prevent duplicate connections
    if (socketRef.current?.connected) return;

    const socket = io({
      path: '/api/socketio',
      auth: { token: sessionToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket.IO] Disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server forcefully disconnected (e.g. auth failure)
        setConnectionError('Disconnected by server. Session may have expired.');
      }
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket.IO] Connection error:', err.message);
      setConnectionError(err.message);
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [sessionToken]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connectionError,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
