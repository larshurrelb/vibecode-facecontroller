'use client';

import { useState, useEffect, useRef } from 'react';

const HTTP_SERVER = "https://remote-dog-face-123.deno.dev";

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
  const [isConnected, setIsConnected] = useState(true); // HTTP is always "connected"
  const [connectionStatus, setConnectionStatus] = useState('Ready');
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus('Ready');
      setLastError(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus('Offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerAnimation = async (key: string) => {
    const trigger = ANIMATION_TRIGGERS.find(t => t.key === key);
    if (!trigger) return;

    // Always update UI immediately for better UX
    setLastPressed(trigger.name);
    setCurrentTrigger(trigger.name);
    setConnectionStatus('Sending...');
    console.log(`� Triggering: ${key} (${trigger.name})`);
    
    // Clear the last pressed indicator after 2 seconds
    setTimeout(() => setLastPressed(null), 2000);

    try {
      const response = await fetch(`${HTTP_SERVER}/api/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, action: trigger.name }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Successfully sent: ${key}`, result);
        setConnectionStatus(`Sent to ${result.clients || 0} client(s)`);
        setLastError(null);
        
        // Reset status after 3 seconds
        setTimeout(() => {
          if (isOnline) {
            setConnectionStatus('Ready');
          }
        }, 3000);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Failed to send: ${key}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      setConnectionStatus('Error');
      setLastError(errorMessage);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        if (isOnline) {
          setConnectionStatus('Ready');
          setLastError(null);
        }
      }, 5000);
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
            <div className={`w-3 h-3 rounded-full ${
              isOnline 
                ? connectionStatus === 'Ready' 
                  ? 'bg-green-500' 
                  : connectionStatus === 'Sending...' 
                    ? 'bg-blue-500' 
                    : 'bg-yellow-500'
                : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {isOnline ? connectionStatus : 'Offline'}
            </span>
          </div>
        </div>

        {/* Animation Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {ANIMATION_TRIGGERS.map((trigger) => (
            <button
              key={trigger.key}
              onClick={() => triggerAnimation(trigger.key)}
              disabled={!isOnline}
              className={`
                p-2 rounded-lg text-center transition-all duration-200 shadow-md
                ${isOnline 
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

        {/* Error Display */}
        {lastError && (
          <div className="mt-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-red-400 mr-2">❌</div>
              <div className="flex-1">
                <p className="text-xs text-red-800 dark:text-red-200">
                  Connection Error
                </p>
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  {lastError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Offline Status */}
        {!isOnline && (
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-2">📱</div>
              <div className="flex-1">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  No internet connection
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                  Commands will work when connection is restored
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            HTTP API: {HTTP_SERVER}/api/trigger
          </p>
        </div>
      </div>
    </div>
  );
}
