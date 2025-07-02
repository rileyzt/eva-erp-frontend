import { useState, useEffect } from 'react';
import { X, Info, MessageCircle } from 'lucide-react';

const FeatureStatusAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Auto-hide after 8 seconds, then show minimized version
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Full Alert */}
      {!isMinimized && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500/git init30 rounded-full p-2">
                  <MessageCircle size={16} className="text-blue-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    EVA Status Update
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="text-green-400 font-medium">✅ ERP Chat Assistant</span> is fully functional!
                    <br />
                    <span className="text-orange-400">🚧 Other features</span> deploying soon.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white transition-colors ml-2"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Badge */}
      {isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <div 
            className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-full px-3 py-2 shadow-lg cursor-pointer hover:bg-blue-500/30 transition-all"
            onClick={() => setIsMinimized(false)}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white font-medium">
                Chat Active
              </span>
              <Info size={12} className="text-blue-300" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureStatusAlert;