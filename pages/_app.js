import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';

// Global Context for EVA App State
import { createContext, useContext } from 'react';

// EVA App Context
const EVAContext = createContext();

export const useEVA = () => {
  const context = useContext(EVAContext);
  if (!context) {
    throw new Error('useEVA must be used within EVAProvider');
  }
  return context;
};

// EVA Provider Component
const EVAProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentPersona, setCurrentPersona] = useState('general');
  const [isOnline, setIsOnline] = useState(true);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load saved preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load theme preference
      const savedTheme = localStorage.getItem('eva-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }

      // Load persona preference
      const savedPersona = localStorage.getItem('eva-persona');
      if (savedPersona) {
        setCurrentPersona(savedPersona);
      }

      // Load conversation history (last session)
      const savedHistory = localStorage.getItem('eva-conversation-history');
      if (savedHistory) {
        try {
          setConversationHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Error loading conversation history:', error);
        }
      }
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && conversationHistory.length > 0) {
      // Only save last 50 messages to prevent localStorage overflow
      const historyToSave = conversationHistory.slice(-50);
      localStorage.setItem('eva-conversation-history', JSON.stringify(historyToSave));
    }
  }, [conversationHistory]);

  // Save persona preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('eva-persona', currentPersona);
    }
  }, [currentPersona]);

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    conversationHistory,
    setConversationHistory,
    currentPersona,
    setCurrentPersona,
    isOnline,
    
    // Helper functions
    addToConversationHistory: (message) => {
      setConversationHistory(prev => [...prev, message]);
    },
    
    clearConversationHistory: () => {
      setConversationHistory([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('eva-conversation-history');
      }
    },
    
    exportConversation: () => {
      return {
        timestamp: new Date().toISOString(),
        persona: currentPersona,
        messages: conversationHistory,
        totalMessages: conversationHistory.length
      };
    }
  };

  return (
    <EVAContext.Provider value={value}>
      {children}
    </EVAContext.Provider>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EVA Error Boundary caught an error:', error, errorInfo);
    
    // You could send this to an error reporting service
    // reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              EVA encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              Refresh Page
            </button>
            
            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-gray-400 cursor-pointer hover:text-white">
                  Error Details (Dev Mode)
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-gray-900/50 p-4 rounded-lg overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring (optional)
const withPerformanceMonitoring = (Component) => {
  return function PerformanceMonitoredComponent(props) {
    useEffect(() => {
      // Monitor page load performance
      if (typeof window !== 'undefined' && window.performance) {
        const navigationTiming = window.performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
          const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
          console.log(`EVA Page Load Time: ${loadTime}ms`);
        }
      }
    }, []);

    return <Component {...props} />;
  };
};

// Main App Component
function EVAApp({ Component, pageProps }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Minimal loading state during hydration */}
      </div>
    );
  }

  const MonitoredComponent = withPerformanceMonitoring(Component);

  return (
    <>
      {/* Global Head Elements */}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <ErrorBoundary>
        <EVAProvider>
          <div className="eva-app">
            {/* Offline Indicator */}
            <OfflineIndicator />
            
            {/* Main App Content */}
            <AnimatePresence mode="wait" initial={false}>
              <MonitoredComponent {...pageProps} />
            </AnimatePresence>
          </div>
        </EVAProvider>
      </ErrorBoundary>
    </>
  );
}

// Offline Indicator Component
const OfflineIndicator = () => {
  const { isOnline } = useEVA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 text-center text-sm">
      <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
      You're currently offline. Some features may not work properly.
    </div>
  );
};

export default EVAApp;

