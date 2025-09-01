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
  const [retryCount, setRetryCount] = useState(0);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHeartbeatRef = useRef<number>(Date.now());

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
  };

  const startHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const now = Date.now();
        // If we haven't received a heartbeat response in 30 seconds, reconnect
        if (now - lastHeartbeatRef.current > 30000) {
          console.log('Heartbeat timeout, reconnecting...');
          connectWebSocket();
        } else {
          // Send ping (the server should echo it back)
          wsRef.current.send('ping');
        }
      }
    }, 10000); // Send ping every 10 seconds
  };

  const processMessageQueue = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && messageQueue.length > 0) {
      const messages = [...messageQueue];
      setMessageQueue([]);
      messages.forEach(message => {
        wsRef.current?.send(message);
        console.log(`Sent queued message: ${message}`);
      });
    }
  };

  const connectWebSocket = () => {
    cleanup();
    
    try {
      setConnectionStatus(`Connecting...${retryCount > 0 ? ` (attempt ${retryCount + 1})` : ''}`);
      wsRef.current = new WebSocket(WS_SERVER);

      wsRef.current.onopen = () => {
        console.log('Connected to Deno animation server');
        setIsConnected(true);
        setConnectionStatus('Connected');
        setRetryCount(0);
        lastHeartbeatRef.current = Date.now();
        startHeartbeat();
        processMessageQueue();
      };

      wsRef.current.onmessage = (event) => {
        const key = event.data;
        lastHeartbeatRef.current = Date.now();
        
        // Ignore ping responses
        if (key === 'ping' || key === 'pong') {
          return;
        }
        
        const trigger = ANIMATION_TRIGGERS.find(t => t.key === key);
        if (trigger) {
          setCurrentTrigger(trigger.name);
          console.log(`Received trigger: ${trigger.name}`);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setConnectionStatus('Connection Error');
      };

      wsRef.current.onclose = (event) => {
        console.log('Disconnected from server', { code: event.code, reason: event.reason });
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        // Implement exponential backoff for reconnection
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Max 30 seconds
        setRetryCount(prev => prev + 1);
        
        setConnectionStatus(`Reconnecting in ${Math.ceil(backoffDelay / 1000)}s...`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, backoffDelay);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus('Failed to connect');
      setIsConnected(false);
    }
  };

  const triggerAnimation = (key: string) => {
    const trigger = ANIMATION_TRIGGERS.find(t => t.key === key);
    if (!trigger) return;

    // Always update UI immediately for better UX
    setLastPressed(trigger.name);
    setCurrentTrigger(trigger.name);
    console.log(`Triggering: ${key} (${trigger.name})`);
    
    // Clear the last pressed indicator after 2 seconds
    setTimeout(() => setLastPressed(null), 2000);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send immediately if connected
      wsRef.current.send(key);
      console.log(`Sent immediately: ${key}`);
    } else {
      // Queue message if not connected
      setMessageQueue(prev => {
        const newQueue = [...prev, key];
        // Keep only the last 10 messages to prevent memory issues
        return newQueue.slice(-10);
      });
      console.log(`Queued message: ${key}`);
      
      // Try to reconnect if not already trying
      if (!isConnected && !reconnectTimeoutRef.current) {
        connectWebSocket();
      }
    }
  };

  const forceReconnect = () => {
    setRetryCount(0);
    connectWebSocket();
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
              className={`
                p-2 rounded-lg text-center transition-all duration-200 shadow-md
                ${isConnected 
                  ? 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 active:scale-95' 
                  : 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 active:scale-95'
                }
                ${lastPressed === trigger.name ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                ${!isConnected ? 'border border-orange-300 dark:border-orange-600' : ''}
              `}
            >
              <div className="text-lg mb-1">{trigger.emoji}</div>
              <div className="text-xs font-medium text-gray-800 dark:text-white leading-tight">
                {trigger.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {trigger.key}
              </div>
              {!isConnected && (
                <div className="text-xs text-orange-600 dark:text-orange-300 mt-1">
                  Will queue
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Connection Help */}
        {!isConnected && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-2">⚠️</div>
              <div className="flex-1">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  {connectionStatus}
                </p>
                {messageQueue.length > 0 && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    {messageQueue.length} message(s) queued
                  </p>
                )}
                <button
                  onClick={forceReconnect}
                  className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 mr-2"
                >
                  Force Reconnect
                </button>
                {retryCount > 0 && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-300">
                    Attempt #{retryCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Connection Info for Connected State */}
        {isConnected && retryCount > 0 && (
          <div className="mt-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-green-400 mr-2">✅</div>
              <p className="text-xs text-green-800 dark:text-green-200">
                Reconnected successfully after {retryCount} attempt(s)
              </p>
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
