import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus, X, ArrowRight } from 'lucide-react';

const RequirementsAnalyzer = ({ onAnalyze }) => {
  const [requirements, setRequirements] = useState({
    companySize: '',
    industry: '',
    currentSystems: [],
    businessProcesses: [],
    integrationNeeds: '',
    budget: '',
    timeline: '',
    specificRequirements: ''
  });
  
  const [newSystem, setNewSystem] = useState('');
  const [newProcess, setNewProcess] = useState('');

  const industries = [
    'Manufacturing', 'Retail', 'Healthcare', 'Financial Services',
    'Technology', 'Education', 'Government', 'Non-profit', 'Other'
  ];

  const companySizes = [
    'Small (1-50 employees)',
    'Medium (51-500 employees)', 
    'Large (501-5000 employees)',
    'Enterprise (5000+ employees)'
  ];

  const budgetRanges = [
    'Under $100K', '$100K - $500K', '$500K - $1M', 
    '$1M - $5M', '$5M+', 'Not determined'
  ];

  const timelineOptions = [
    '3-6 months', '6-12 months', '1-2 years', '2+ years', 'Flexible'
  ];

  const addSystem = () => {
    if (newSystem.trim()) {
      setRequirements(prev => ({
        ...prev,
        currentSystems: [...prev.currentSystems, newSystem.trim()]
      }));
      setNewSystem('');
    }
  };

  const removeSystem = (index) => {
    setRequirements(prev => ({
      ...prev,
      currentSystems: prev.currentSystems.filter((_, i) => i !== index)
    }));
  };

  const addProcess = () => {
    if (newProcess.trim()) {
      setRequirements(prev => ({
        ...prev,
        businessProcesses: [...prev.businessProcesses, newProcess.trim()]
      }));
      setNewProcess('');
    }
  };

  const removeProcess = (index) => {
    setRequirements(prev => ({
      ...prev,
      businessProcesses: prev.businessProcesses.filter((_, i) => i !== index)
    }));
  };

  const handleAnalyze = () => {
    onAnalyze(requirements);
  };

  const isFormValid = requirements.companySize && requirements.industry && 
                     requirements.businessProcesses.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4"
    >
      <div className="glass-panel p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">ERP Requirements Analyzer</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Company Information</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Company Size</label>
              <select
                value={requirements.companySize}
                onChange={(e) => setRequirements(prev => ({ ...prev, companySize: e.target.value }))}
                className="glass-input w-full p-3 text-white"
              >
                <option value="">Select company size</option>
                {companySizes.map(size => (
                  <option key={size} value={size} className="bg-dark-700">{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Industry</label>
              <select
                value={requirements.industry}
                onChange={(e) => setRequirements(prev => ({ ...prev, industry: e.target.value }))}
                className="glass-input w-full p-3 text-white"
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry} className="bg-dark-700">{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Budget Range</label>
              <select
                value={requirements.budget}
                onChange={(e) => setRequirements(prev => ({ ...prev, budget: e.target.value }))}
                className="glass-input w-full p-3 text-white"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(budget => (
                  <option key={budget} value={budget} className="bg-dark-700">{budget}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Implementation Timeline</label>
              <select
                value={requirements.timeline}
                onChange={(e) => setRequirements(prev => ({ ...prev, timeline: e.target.value }))}
                className="glass-input w-full p-3 text-white"
              >
                <option value="">Select timeline</option>
                {timelineOptions.map(timeline => (
                  <option key={timeline} value={timeline} className="bg-dark-700">{timeline}</option>
                ))}
              </select>
            </div>
          </div>

          {/* System Requirements */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">System Requirements</h3>
            
            {/* Current Systems */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Systems</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSystem}
                  onChange={(e) => setNewSystem(e.target.value)}
                  placeholder="e.g., QuickBooks, Excel, Legacy ERP"
                  className="glass-input flex-1 p-2 text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addSystem()}
                />
                <button
                  onClick={addSystem}
                  className="glass-button p-2"
                >
                  <Plus size={16} className="text-gray-300" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirements.currentSystems.map((system, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                  >
                    <span>{system}</span>
                    <button onClick={() => removeSystem(index)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Business Processes */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Key Business Processes</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  placeholder="e.g., Order Management, Inventory, HR"
                  className="glass-input flex-1 p-2 text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addProcess()}
                />
                <button
                  onClick={addProcess}
                  className="glass-button p-2"
                >
                  <Plus size={16} className="text-gray-300" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {requirements.businessProcesses.map((process, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center space-x-1 bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full"
                  >
                    <span>{process}</span>
                    <button onClick={() => removeProcess(index)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Integration Needs */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Integration Requirements</label>
              <textarea
                value={requirements.integrationNeeds}
                onChange={(e) => setRequirements(prev => ({ ...prev, integrationNeeds: e.target.value }))}
                placeholder="Describe systems that need to integrate with your ERP..."
                className="glass-input w-full p-3 text-white text-sm resize-none"
                rows={3}
              />
            </div>

            {/* Specific Requirements */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Specific Requirements</label>
              <textarea
                value={requirements.specificRequirements}
                onChange={(e) => setRequirements(prev => ({ ...prev, specificRequirements: e.target.value }))}
                placeholder="Any specific functionality, compliance, or technical requirements..."
                className="glass-input w-full p-3 text-white text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!isFormValid}
            className="glass-button px-6 py-3 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border-glow"
          >
            <span>Analyze Requirements</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RequirementsAnalyzer;