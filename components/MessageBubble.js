import { motion } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  // Helper function to check if content needs markdown rendering
  const needsMarkdownRendering = (content) => {
    return content.includes('**') || 
           content.includes('*') || 
           content.includes('```') || 
           content.includes('#') ||
           content.includes('[') ||
           content.includes('`');
  };
  
  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : isSystem
          ? 'bg-gradient-to-r from-green-500 to-teal-600'
          : 'bg-gradient-to-r from-orange-500 to-red-600'
      }`}>
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>
      
      {/* Message Content */}
      <div className={`flex-1 max-w-4xl ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`relative group ${
          isUser 
            ? 'message-user' 
            : isSystem
            ? 'bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-2xl'
            : 'message-assistant'
        } p-4 ${message.isError ? 'border-red-500/50 bg-red-500/10' : ''}`}>
          
          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(message.content)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glass-button p-1.5"
            title="Copy message"
          >
            {copied ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="text-gray-400" />
            )}
          </button>
          
          {/* Message Text */}
          <div className={`text-sm leading-relaxed ${
            isUser ? 'text-white' : 'text-gray-100'
          } pr-8`}>
            {needsMarkdownRendering(message.content) ? (
              <ReactMarkdown
                components={{
                  // Handle bold text
                  strong: ({ children }) => (
                    <strong className="font-bold text-white">{children}</strong>
                  ),
                  // Handle italic text
                  em: ({ children }) => (
                    <em className="italic text-gray-200">{children}</em>
                  ),
                  // Handle code blocks
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-4">
                        <div className="flex items-center justify-between bg-dark-700 px-4 py-2 rounded-t-lg">
                          <span className="text-xs text-gray-400 font-medium">
                            {match[1].toUpperCase()}
                          </span>
                          <button
                            onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                            className="glass-button p-1"
                          >
                            <Copy size={12} className="text-gray-400" />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-t-none rounded-b-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-dark-700 px-2 py-1 rounded text-blue-300" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-blue-300">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-blue-300">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-md font-bold mb-2 text-blue-300">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500/50 pl-4 my-3 text-gray-300 italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
          
          {/* Metadata */}
          {message.metadata && (
            <div className="mt-3 pt-3 border-t border-glass-200">
              {message.metadata.analysisType && (
                <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full mr-2">
                  {message.metadata.analysisType}
                </span>
              )}
              {message.metadata.codeLanguage && (
                <span className="inline-block bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full mr-2">
                  {message.metadata.codeLanguage}
                </span>
              )}
              {message.metadata.complexity && (
                <span className="inline-block bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  Complexity: {message.metadata.complexity}
                </span>
              )}
            </div>
          )}
          
          {/* Timestamp */}
          <div className="mt-2 text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;