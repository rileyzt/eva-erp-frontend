import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, Download, Settings, Bot, User, FileText, Code, BarChart3, X, ArrowRight, ArrowLeft, Play, CheckCircle, Users, MessageSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import FileUpload from './FileUpload';
import ExportModal from './ExportModal';
import PersonaSelector from './PersonaSelector';
import RequirementsAnalyzer from './RequirementsAnalyzer';
import CodeGenerator from './CodeGenerator';

// Guided Tour Component
const GuidedTour = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to EVA! 👋',
      description: 'Your ERP Virtual Assistant',
      content: `Hi there! I'm EVA, your personal ERP implementation consultant. I'm here to help you with SAP, Oracle, and Microsoft Dynamics. 

Let me show you around in just 2 minutes!`,
      icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
      highlight: null,
      position: 'center'
    },
    {
      id: 'what-is-erp',
      title: 'What is ERP?',
      description: 'Let me explain in simple terms',
      content: (
        <div>
          <p className="mb-4">🏢 <strong className="text-blue-400">ERP (Enterprise Resource Planning)</strong> is like the brain of a business:</p>
          <ul className="space-y-2 mb-4">
            <li>• <strong className="text-green-400">Finance</strong> - Handles money, budgets, accounting</li>
            <li>• <strong className="text-blue-400">Sales</strong> - Manages customers, orders, invoices</li>
            <li>• <strong className="text-yellow-400">Inventory</strong> - Tracks products, stock levels</li>
            <li>• <strong className="text-purple-400">HR</strong> - Employee data, payroll, benefits</li>
            <li>• <strong className="text-red-400">Manufacturing</strong> - Production planning, quality</li>
          </ul>
          <p>Think of it as one system that connects all parts of your business!</p>
        </div>
      ),
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      highlight: null,
      position: 'center'
    },
    {
      id: 'personas',
      title: 'Choose Your Expert 👨‍💼',
      description: 'I have specialist knowledge in different ERP systems',
      content: (
        <div>
          <p className="mb-4">I can be your specialist consultant for:</p>
          <div className="space-y-4">
            <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
              <p>🔵 <strong className="text-blue-400">SAP Consultant</strong> - World's #1 ERP system</p>
              <ul className="ml-4 mt-2 space-y-1 text-sm">
                <li>• Best for large enterprises</li>
                <li>• Strong in manufacturing & finance</li>
                <li>• Generates ABAP code</li>
              </ul>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-3 border border-orange-500/30">
              <p>🟠 <strong className="text-orange-400">Oracle Specialist</strong> - Powerful database-driven ERP</p>
              <ul className="ml-4 mt-2 space-y-1 text-sm">
                <li>• Great for complex businesses</li>
                <li>• Strong reporting & analytics</li>
              </ul>
            </div>
            <div className="bg-green-900/30 rounded-lg p-3 border border-green-500/30">
              <p>🟢 <strong className="text-green-400">Dynamics Expert</strong> - Microsoft's user-friendly ERP</p>
              <ul className="ml-4 mt-2 space-y-1 text-sm">
                <li>• Excellent for growing companies</li>
                <li>• Integrates with Office 365</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Just tell me which one interests you most!</p>
        </div>
      ),
      icon: <Users className="w-8 h-8 text-purple-400" />,
      highlight: '.persona-selector',
      position: 'bottom'
    },
    {
      id: 'chat-basics',
      title: 'Just Talk to Me! 💬',
      description: 'I understand plain English',
      content: (
        <div>
          <p className="mb-4">You can ask me anything like:</p>
          <div className="space-y-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-blue-500">
              <p className="text-blue-300">💡 <em>"My company has 50 employees and we're struggling with inventory tracking. What ERP should we use?"</em></p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-green-500">
              <p className="text-green-300">💡 <em>"We're using old spreadsheets for accounting. Can you help us move to SAP?"</em></p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-purple-500">
              <p className="text-purple-300">💡 <em>"Generate ABAP code for a customer order report"</em></p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-yellow-500">
              <p className="text-yellow-300">💡 <em>"What modules do we need for a manufacturing business?"</em></p>
            </div>
          </div>
          <p className="mt-4">I'll ask follow-up questions to understand your needs better!</p>
        </div>
      ),
      icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
      highlight: '.chat-input',
      position: 'top'
    },
    {
      id: 'requirements-analyzer',
      title: 'ERP Requirements Analyzer 📊',
      description: 'Let me analyze your business needs',
      content: (
        <div>
          <p className="mb-4">This is my <strong className="text-green-400">smart questionnaire</strong>:</p>
          <div className="space-y-4">
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <p className="font-semibold text-green-400 mb-2">✅ Tell me about your business</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Industry, size, main challenges</li>
                <li>• Current systems you're using</li>
                <li>• What's not working well</li>
              </ul>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
              <p className="font-semibold text-blue-400 mb-2">✅ I'll recommend the perfect ERP</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Which system fits your needs</li>
                <li>• What modules you need</li>
                <li>• Implementation timeline</li>
                <li>• Rough cost estimates</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Perfect if you're just starting your ERP journey!</p>
        </div>
      ),
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      highlight: '.requirements-analyzer',
      position: 'bottom'
    },
    {
      id: 'document-upload',
      title: 'Upload Your Documents 📄',
      description: 'I can read and analyze your business documents',
      content: (
        <div>
          <p className="mb-4">Got existing documents? I can help!</p>
          <div className="space-y-4">
            <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
              <p className="font-semibold text-yellow-400 mb-2">📋 Upload any of these:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Business process documents</li>
                <li>• Current system reports</li>
                <li>• Requirements specifications</li>
                <li>• Technical documentation</li>
              </ul>
            </div>
            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
              <p className="font-semibold text-cyan-400 mb-2">🧠 I'll analyze and:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Identify your ERP needs</li>
                <li>• Suggest improvements</li>
                <li>• Create implementation plans</li>
                <li>• Generate technical solutions</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Just drag & drop - I'll do the rest!</p>
        </div>
      ),
      icon: <Upload className="w-8 h-8 text-yellow-400" />,
      highlight: '.file-upload',
      position: 'bottom'
    },
    {
      id: 'code-generator',
      title: 'SAP Code Generator ⚡',
      description: 'I write code for you!',
      content: (
        <div>
          <p className="mb-4">Need technical implementation? I've got you covered:</p>
          <div className="space-y-4">
            <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-500/30">
              <p className="font-semibold text-pink-400 mb-2">🔧 I can generate:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• <strong className="text-blue-300">ABAP Code</strong> - SAP programming language</li>
                <li>• <strong className="text-green-300">Configuration Scripts</strong> - Setup commands</li>
                <li>• <strong className="text-yellow-300">Workflow Designs</strong> - Process automation</li>
                <li>• <strong className="text-purple-300">Report Templates</strong> - Custom reports</li>
                <li>• <strong className="text-cyan-300">Integration Code</strong> - Connect systems</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border-l-4 border-pink-500">
              <p className="text-gray-300">Just describe what you need in plain English:</p>
              <p className="text-pink-300 italic mt-1">"Create a report showing monthly sales by region"</p>
            </div>
          </div>
          <p className="mt-4">I'll write the complete code!</p>
        </div>
      ),
      icon: <Code className="w-8 h-8 text-pink-400" />,
      highlight: '.code-generator',
      position: 'bottom'
    },
    {
      id: 'export-results',
      title: 'Export Everything 💾',
      description: 'Take your consultation results with you',
      content: (
        <div>
          <p className="mb-4">Don't lose our conversation! You can export:</p>
          <div className="space-y-4">
            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
              <p className="font-semibold text-cyan-400 mb-2">📄 Consultation Reports</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Complete conversation history</li>
                <li>• Recommendations summary</li>
                <li>• Implementation roadmap</li>
              </ul>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <p className="font-semibold text-green-400 mb-2">💻 Generated Code</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• ABAP programs</li>
                <li>• Configuration scripts</li>
                <li>• Setup instructions</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <p className="font-semibold text-purple-400 mb-2">📊 Analysis Results</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Requirements assessment</li>
                <li>• ERP comparison charts</li>
                <li>• Cost estimates</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Perfect for sharing with your team or management!</p>
        </div>
      ),
      icon: <Download className="w-8 h-8 text-cyan-400" />,
      highlight: '.export-button',
      position: 'top'
    },
    {
      id: 'memory',
      title: 'I Remember Everything 🧠',
      description: 'Multi-step conversations made easy',
      content: (
        <div>
          <p className="mb-4">Unlike basic chatbots, I have <strong className="text-blue-400">conversation memory</strong>:</p>
          <div className="space-y-4">
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
              <p className="font-semibold text-blue-400 mb-2">🔄 I remember:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Your business details</li>
                <li>• Previous questions & answers</li>
                <li>• Your ERP preferences</li>
                <li>• Generated code & recommendations</li>
              </ul>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <p className="font-semibold text-green-400 mb-2">💬 This means:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• No need to repeat information</li>
                <li>• I can reference earlier discussions</li>
                <li>• Complex consultations flow naturally</li>
                <li>• Follow-up questions make sense</li>
              </ul>
            </div>
          </div>
          <p className="mt-4">Feel free to have long, detailed conversations with me!</p>
        </div>
      ),
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      highlight: null,
      position: 'center'
    },
    {
      id: 'ready',
      title: 'You\'re Ready! 🚀',
      description: 'Start your ERP journey with confidence',
      content: (
        <div>
          <p className="mb-4"><strong className="text-green-400">Congratulations!</strong> You now know how to use EVA effectively.</p>
          <div className="space-y-4">
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
              <p className="font-semibold text-blue-400 mb-2">🎯 Quick Start Tips:</p>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Start with simple questions</li>
                <li>• Be specific about your industry/size</li>
                <li>• Don't worry about ERP jargon - I'll translate</li>
                <li>• Use the document upload for complex needs</li>
                <li>• Export important results</li>
              </ul>
            </div>
            <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
              <p className="font-semibold text-green-400 mb-2">🤝 Remember:</p>
              <p className="text-sm">I'm here to help, not to sell you anything. I'll give you honest, objective advice about what's best for YOUR business.</p>
            </div>
          </div>
          <p className="mt-4">Ready to transform your business with the right ERP system?</p>
        </div>
      ),
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      highlight: null,
      position: 'center'
    }
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  const startTour = () => {
    setCurrentStep(1);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft') prevStep();
      if (e.key === 'Escape') skipTour();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentTourStep.icon}
              <div>
                <h2 className="text-xl font-bold text-white">{currentTourStep.title}</h2>
                <p className="text-gray-400 text-sm">{currentTourStep.description}</p>
              </div>
            </div>
            <button
              onClick={skipTour}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {tourSteps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="text-gray-300">
            {typeof currentTourStep.content === 'string' ? (
              <div className="whitespace-pre-line leading-relaxed">
                {currentTourStep.content}
              </div>
            ) : (
              currentTourStep.content
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStep === 0 && (
                <button
                  onClick={startTour}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Tour</span>
                </button>
              )}
              
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center space-x-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={skipTour}
                className="text-gray-400 hover:text-white transition-colors px-4 py-2"
              >
                Skip Tour
              </button>
              
              {currentStep > 0 && (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <span>{currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}</span>
                  {currentStep < tourSteps.length - 1 && <ArrowRight className="w-4 h-4" />}
                  {currentStep === tourSteps.length - 1 && <CheckCircle className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
          
          {/* Keyboard Shortcuts */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            Use ← → arrow keys to navigate • Press Escape to skip
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm EVA, your ERP Virtual Assistant. I specialize in ERP consultation, requirements analysis, and SAP code generation. How can I help you with your ERP implementation today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentPersona, setCurrentPersona] = useState('general');
  const [activeFeature, setActiveFeature] = useState('chat');
  const [conversationMemory, setConversationMemory] = useState([]);
  
  // Guided Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user has seen the tour before
  useEffect(() => {
    const tourSeen = localStorage.getItem('eva-tour-completed');
    setHasSeenTour(!!tourSeen);
    
    // Auto-show tour for first-time users after 2 seconds
    if (!tourSeen) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('eva-tour-completed', 'true');
  };

  const handleTourClose = () => {
    setIsTourOpen(false);
  };

  const startTour = () => {
    setIsTourOpen(true);
  };
  
// Replace your existing sendMessage function with this enhanced version
const sendMessage = async () => {
  if (!inputMessage.trim()) return;
  
  const userMessage = {
    id: Date.now(),
    type: 'user',
    content: inputMessage,
    timestamp: new Date().toISOString()
  };
  
  setMessages(prev => [...prev, userMessage]);
  setConversationMemory(prev => [...prev, userMessage]);
  const currentInput = inputMessage; // Store current input
  setInputMessage('');
  setIsTyping(true);
  
  try {
    console.log('🚀 Sending message:', currentInput);
    console.log('📝 Persona:', currentPersona);
    console.log('🔧 Feature:', activeFeature);
    
    const requestBody = {
      message: currentInput,
      persona: currentPersona,
      conversationHistory: conversationMemory,
      feature: activeFeature
    };
    
    console.log('📦 Request payload:', requestBody);
    
    const response = await fetch("https://eva-erp-backend.onrender.com/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    // Get response text first to handle both JSON and text responses
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    if (!response.ok) {
      // Enhanced error handling with detailed information
      let errorMessage = 'Failed to send message';
      let errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      };
      
      try {
        // Try to parse error response as JSON
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || `Server error: ${response.status}`;
        errorDetails = { ...errorDetails, ...errorData };
      } catch (parseError) {
        // If not JSON, use the text response
        errorMessage = responseText || `HTTP ${response.status}: ${response.statusText}`;
      }
      
      console.error('❌ API Error:', errorDetails);
      
      // Show user-friendly error message
      const errorMsgForUser = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `I'm sorry, I encountered an error: ${errorMessage}\n\nThis might be due to:\n• API endpoint not available\n• Server configuration issues\n• Network connectivity problems\n\nPlease check your API setup and try again.`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMsgForUser]);
      return;
    }
    
    // Parse successful response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('✅ Parsed response data:', data);
    
    // Validate response structure
    if (!data.response && !data.message && !data.content) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response format from server');
    }
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: data.response || data.message || data.content,
      timestamp: new Date().toISOString(),
      metadata: data.metadata || {}
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setConversationMemory(prev => [...prev, assistantMessage]);
    
    console.log('✅ Message sent successfully');
    
  } catch (error) {
    console.error('❌ Network/Fetch Error:', error);
    
    // Determine error type and provide specific guidance
    let userErrorMessage = 'Sorry, I encountered an error. ';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      userErrorMessage += 'Unable to connect to the server. Please check if your API endpoint is running.';
    } else if (error.message.includes('JSON')) {
      userErrorMessage += 'Received an invalid response from the server. Please check your API implementation.';
    } else if (error.message.includes('NetworkError')) {
      userErrorMessage += 'Network connection failed. Please check your internet connection.';
    } else {
      userErrorMessage += `${error.message}`;
    }
    
    const errorMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: userErrorMessage + '\n\n**Troubleshooting Tips:**\n• Ensure `/api/chat` endpoint exists\n• Check server console for errors\n• Verify your LangChain/Groq API configuration\n• Check network connectivity',
      timestamp: new Date().toISOString(),
      isError: true
    };
    
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsTyping(false);
  }
};
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  const handleFileUpload = async (files) => {
    // Implementation for file upload
    const uploadResults = [];
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          uploadResults.push(result);
        }
      } catch (error) {
        console.error('File upload error:', error);
      }
    }
    
    if (uploadResults.length > 0) {
      const uploadMessage = {
        id: Date.now(),
        type: 'system',
        content: `Successfully uploaded ${uploadResults.length} document(s). I can now analyze them for ERP requirements.`,
        timestamp: new Date().toISOString(),
        metadata: { uploadResults }
      };
      setMessages(prev => [...prev, uploadMessage]);
    }
    
    setShowFileUpload(false);
  };
  
  const features = [
    { id: 'chat', icon: Bot, label: 'ERP Chat', description: 'General ERP consultation' },
    { id: 'analyzer', icon: BarChart3, label: 'Requirements Analyzer', description: 'Analyze business requirements' },
    { id: 'generator', icon: Code, label: 'SAP Code Generator', description: 'Generate SAP/ABAP code' },
    { id: 'migration', icon: FileText, label: 'Migration Assistant', description: 'Plan data migration' }
  ];
  
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EVA</h1>
                <p className="text-sm text-gray-400">ERP Virtual Assistant</p>
              </div>
            </div>
            
            {/* Feature Tabs */}
            <div className="hidden md:flex items-center space-x-2 ml-8">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeFeature === feature.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                  title={feature.description}
                >
                  <feature.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Tour Button */}
            <button
              onClick={startTour}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              title="Take the guided tour"
            >
              <Play className="w-5 h-5" />
            </button>
            
            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="export-button p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              title="Export conversation"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-gray-900/50 backdrop-blur-xl border-r border-gray-700/50 p-6 overflow-y-auto"
        >
          {/* Persona Selector */}
          <div className="persona-selector mb-6">
            <PersonaSelector 
              currentPersona={currentPersona}
              onPersonaChange={setCurrentPersona}
            />
          </div>
          
          {/* Quick Actions based on Active Feature */}
          <div className="space-y-4">
            {activeFeature === 'chat' && (
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3">Quick Start</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setInputMessage("What ERP system would you recommend for my business?")}
                    className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    💡 ERP System Recommendation
                  </button>
                  <button 
                    onClick={() => setInputMessage("Help me understand SAP modules")}
                    className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    📚 Learn about SAP Modules
                  </button>
                  <button 
                    onClick={() => setInputMessage("What's the difference between SAP, Oracle, and Dynamics?")}
                    className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    🔍 Compare ERP Systems
                  </button>
                </div>
              </div>
            )}
            
            {activeFeature === 'analyzer' && (
              <div className="requirements-analyzer bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <RequirementsAnalyzer onAnalysisComplete={(analysis) => {
                  const analysisMessage = {
                    id: Date.now(),
                    type: 'assistant',
                    content: `Based on your requirements analysis, here are my recommendations:\n\n${analysis}`,
                    timestamp: new Date().toISOString(),
                    metadata: { type: 'analysis' }
                  };
                  setMessages(prev => [...prev, analysisMessage]);
                }} />
              </div>
            )}
            
            {activeFeature === 'generator' && (
              <div className="code-generator bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                <CodeGenerator onCodeGenerated={(code) => {
                  const codeMessage = {
                    id: Date.now(),
                    type: 'assistant',
                    content: `Here's the generated code:\n\n\`\`\`abap\n${code}\n\`\`\``,
                    timestamp: new Date().toISOString(),
                    metadata: { type: 'code', language: 'abap' }
                  };
                  setMessages(prev => [...prev, codeMessage]);
                }} />
              </div>
            )}
          </div>
          
          {/* Recent Topics */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">Recent Topics</h3>
            <div className="space-y-2">
              {conversationMemory
                .filter(msg => msg.type === 'user')
                .slice(-5)
                .map((msg, index) => (
                  <div key={index} className="p-3 bg-gray-800/20 rounded-lg border border-gray-700/30">
                    <p className="text-sm text-gray-300 truncate">{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </motion.aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageBubble message={message} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700/50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="chat-input flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about ERP systems, SAP implementations, or business requirements..."
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    rows="3"
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                  />
                  
                  {/* File Upload Button */}
                  <button
                    onClick={() => setShowFileUpload(true)}
                    className="file-upload absolute right-12 bottom-3 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                    title="Upload documents"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Input Hints */}
              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send • Shift+Enter for new line • Upload documents for analysis
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <FileUpload
                onFilesSelected={handleFileUpload}
                onClose={() => setShowFileUpload(false)}
              />
            </motion.div>
          </motion.div>
        )}
        
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ExportModal
                messages={messages}
                conversationMemory={conversationMemory}
                onClose={() => setShowExportModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Tour */}
      <GuidedTour 
        isOpen={isTourOpen}
        onClose={handleTourClose}
        onComplete={handleTourComplete}
      />

      {/* Welcome Banner for First-Time Users */}
      {!hasSeenTour && !isTourOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-2xl border border-blue-400/20 max-w-sm z-30"
        >
          <div className="flex items-start space-x-3">
            <Bot className="w-6 h-6 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Welcome to EVA! 👋</h4>
              <p className="text-sm opacity-90 mb-3">
                I'm your ERP Virtual Assistant. Want a quick tour to see what I can do?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={startTour}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded-lg transition-all"
                >
                  Yes, show me!
                </button>
                <button
                  onClick={() => setHasSeenTour(true)}
                  className="text-white/70 hover:text-white text-sm px-3 py-1 transition-all"
                >
                  Maybe later
                </button>
              </div>
            </div>
            <button
              onClick={() => setHasSeenTour(true)}
              className="text-white/70 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;