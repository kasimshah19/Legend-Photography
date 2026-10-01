'use client';

import { useSocket } from './SocketProvider';
import { Wifi, WifiOff } from 'lucide-react';

export function RealtimeStatus() {
  const { isConnected, connectionError } = useSocket();

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {isConnected ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-600 hidden sm:inline">Live</span>
        </>
      ) : (
        <>
          <WifiOff size={12} className="text-gray-400" />
          <span className="text-gray-400 hidden sm:inline">Offline</span>
        </>
      )}
    </div>
  );
}
