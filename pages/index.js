import { useState, useEffect } from 'react';
import Head from 'next/head';
import ChatInterface from '../components/ChatInterface';
import FeatureStatusAlert from '../components/FeatureStatusAlert';  // Added import
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>EVA - ERP Virtual Assistant</title>
          <meta name="description" content="Your intelligent ERP consultant for SAP, Oracle, and Microsoft Dynamics implementations" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* EVA Logo Animation */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
              <span className="text-3xl font-bold text-white">EVA</span>
            </motion.div>
            
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                ERP Virtual Assistant
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Initializing your ERP consultation experience...
              </p>
              
              {/* Loading Progress */}
              <div className="w-64 mx-auto">
                <div className="bg-gray-800 rounded-full h-2 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  />
                </div>
                
                {/* Loading Steps */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-500 space-y-1"
                >
                  <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🔧 Loading ERP knowledge base...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  >
                    🧠 Preparing AI consultation engine...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  >
                    🚀 Ready to help with your ERP journey!
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>EVA - ERP Virtual Assistant</title>
        <meta name="description" content="Your intelligent ERP consultant for SAP, Oracle, and Microsoft Dynamics implementations" />
        <meta name="keywords" content="ERP, SAP, Oracle, Microsoft Dynamics, ERP consultant, business software, implementation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="EVA - ERP Virtual Assistant" />
        <meta property="og:description" content="Your intelligent ERP consultant for SAP, Oracle, and Microsoft Dynamics implementations" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eva-erp-assistant.com" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EVA - ERP Virtual Assistant" />
        <meta name="twitter:description" content="Your intelligent ERP consultant for SAP, Oracle, and Microsoft Dynamics implementations" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/eva-logo.svg" as="image" />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <ChatInterface />
        {/* Added Feature Status Alert - appears after loading */}
        <FeatureStatusAlert />
      </motion.div>
    </>
  );
}