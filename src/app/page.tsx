'use client';

import { useState, useEffect, useRef } from 'react';

const WS_SERVER = "wss://remote-dog-face-123.deno.dev";

interface AnimationTrigger {
  key: string;
  name: string;
  emoji: string;
}

const ANIMATION_TRIGGERS: AnimationTrigger[] = [
  { key: '1', name: 'Idle', emoji: '😌' },
  { key: '2', name: 'Puppy Eyes', emoji: '🥺' },
  { key: '3', name: 'Staring', emoji: '👀' },
  { key: '4', name: 'Happy', emoji: '😄' },
  { key: '5', name: 'Panting', emoji: '😛' },
  { key: '6', name: 'Sighing', emoji: '😮‍💨' },
  { key: '7', name: 'Barking', emoji: '🐕' },
  { key: '8', name: 'Woofing', emoji: '🐶' },
  { key: '9', name: 'Bumping', emoji: '💥' },
  { key: 'ß', name: 'Gaze Right', emoji: '👉' },
  { key: '0', name: 'Gaze Left', emoji: '👈' },
  { key: 'i', name: 'Stop All Sounds', emoji: '🔇' },
];

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      setConnectionStatus('Connecting...');
      wsRef.current = new WebSocket(WS_SERVER);

      wsRef.current.onopen = () => {
        console.log('Connected to Deno animation server');
        setIsConnected(true);
        setConnectionStatus('Connected');
      };

      wsRef.current.onmessage = (event) => {
        const key = event.data;
        const trigger = ANIMATION_TRIGGERS.find(t => t.key === key);
        if (trigger) {
          setCurrentTrigger(trigger.name);
          console.log(`Received trigger: ${trigger.name}`);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('Error');
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from server');
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => connectWebSocket(), 5000);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus('Failed to connect');
    }
  };

  const triggerAnimation = (key: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(key);
      const trigger = ANIMATION_TRIGGERS.find(t => t.key === key);
      if (trigger) {
        setLastPressed(trigger.name);
        setCurrentTrigger(trigger.name);
        console.log(`Sent trigger: ${key} (${trigger.name})`);
        
        // Clear the last pressed indicator after 2 seconds
        setTimeout(() => setLastPressed(null), 2000);
      }
    } else {
      console.log('WebSocket not connected');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
            Face Controller
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Animation Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {ANIMATION_TRIGGERS.map((trigger) => (
            <button
              key={trigger.key}
              onClick={() => triggerAnimation(trigger.key)}
              disabled={!isConnected}
              className={`
                p-2 rounded-lg text-center transition-all duration-200 shadow-md
                ${isConnected 
                  ? 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95' 
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50'
                }
                ${lastPressed === trigger.name ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
              `}
            >
              <div className="text-lg mb-1">{trigger.emoji}</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white leading-tight">
                {trigger.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {trigger.key}
              </div>
            </button>
          ))}
        </div>

        {/* Connection Help */}
        {!isConnected && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-2">⚠️</div>
              <div>
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  Not connected to server. Attempting to reconnect...
                </p>
                <button
                  onClick={connectWebSocket}
                  className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-center">
         
        </div>
      </div>
    </div>
  );
}
