'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Minimize2, Maximize2, Mic, MicOff } from 'lucide-react';

export function JavariWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages from Javari iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://javari.craudiovizai.com') return;
      
      if (event.data.type === 'NEW_MESSAGE') {
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  // Clear unread when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const toggleVoice = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage({
        type: 'TOGGLE_VOICE',
        listening: !isListening
      }, 'https://javari.craudiovizai.com');
    }
    setIsListening(!isListening);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 p-4 bg-navy-600 hover:bg-navy-700 
          rounded-full shadow-lg hover:shadow-xl transition-all z-50
          ${isOpen ? 'scale-0' : 'scale-100'}
        `}
        aria-label="Open Javari AI Assistant"
      >
        <MessageSquare className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        <div className="absolute -top-1 -left-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div 
          className={`
            fixed z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl 
            flex flex-col border border-gray-200 dark:border-gray-800
            transition-all duration-300
            ${isMinimized 
              ? 'bottom-6 right-6 w-80 h-16' 
              : 'bottom-6 right-6 w-96 h-[600px] md:w-[28rem] md:h-[700px]'
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-navy-600 to-cyan-600 rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Javari AI</h3>
                <p className="text-xs text-white/80">Your AI Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-white" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </button>
              
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4 text-white" />
                ) : (
                  <Minimize2 className="h-4 w-4 text-white" />
                )}
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Iframe content */}
          {!isMinimized && (
            <iframe
              ref={iframeRef}
              src={`https://javari.craudiovizai.com/embed?origin=${encodeURIComponent(window.location.href)}`}
              className="flex-1 border-0 w-full"
              allow="microphone; camera; clipboard-write"
              title="Javari AI Chat Interface"
            />
          )}
        </div>
      )}
    </>
  );
}
