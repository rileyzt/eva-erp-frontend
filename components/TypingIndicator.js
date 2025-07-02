import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-3"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
        <Bot size={16} className="text-white" />
      </div>
      
      {/* Typing Animation */}
      <div className="message-assistant p-4 max-w-xs">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">EVA is thinking</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;