import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Code, BarChart3, Database, Settings } from 'lucide-react';

const PersonaSelector = ({ currentPersona, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const personas = [
    {
      id: 'general',
      name: 'General ERP Consultant',
      icon: User,
      description: 'Broad ERP knowledge and implementation guidance',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'sap',
      name: 'SAP Specialist',
      icon: Code,
      description: 'SAP-specific implementation and ABAP development',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'oracle',
      name: 'Oracle Expert',
      icon: Database,
      description: 'Oracle ERP Cloud and on-premise solutions',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'dynamics',
      name: 'Microsoft Dynamics Consultant',
      icon: Settings,
      description: 'Dynamics 365 and Business Central expertise',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'analyst',
      name: 'Business Analyst',
      icon: BarChart3,
      description: 'Requirements gathering and process analysis',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const currentPersonaData = personas.find(p => p.id === currentPersona);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button px-3 py-2 flex items-center space-x-2 min-w-0"
      >
        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentPersonaData.color} flex items-center justify-center flex-shrink-0`}>
          <currentPersonaData.icon size={12} className="text-white" />
        </div>
        <span className="text-sm text-gray-300 truncate max-w-32">
          {currentPersonaData.name}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full mt-2 right-0 w-80 glass-panel p-2 z-50"
            >
              <div className="space-y-1">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onChange(persona.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start space-x-3 ${
                      currentPersona === persona.id
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'hover:bg-glass-100'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${persona.color} flex items-center justify-center flex-shrink-0`}>
                      <persona.icon size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {persona.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-glass-200">
                <p className="text-xs text-gray-400 px-3">
                  Select a specialist persona to get more targeted ERP guidance and recommendations.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonaSelector;