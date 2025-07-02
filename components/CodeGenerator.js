import { useState } from 'react'

const CodeGenerator = ({ onGenerate, isGenerating, generatedCode }) => {
  const [requirement, setRequirement] = useState('')
  const [codeType, setCodeType] = useState('abap')
  const [complexity, setComplexity] = useState('medium')
  const [includeComments, setIncludeComments] = useState(true)

  const handleGenerate = () => {
    if (!requirement.trim()) return
    
    onGenerate({
      requirement: requirement.trim(),
      codeType,
      complexity,
      includeComments
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode.code)
    // You could add a toast notification here
  }

  const codeTypes = [
    { value: 'abap', label: 'ABAP', description: 'SAP ABAP programming' },
    { value: 'workflow', label: 'Workflow', description: 'SAP workflow configuration' },
    { value: 'fiori', label: 'Fiori UI5', description: 'SAP Fiori/UI5 development' },
    { value: 'integration', label: 'Integration', description: 'SAP integration patterns' },
    { value: 'config', label: 'Configuration', description: 'SAP configuration scripts' }
  ]

  const complexityLevels = [
    { value: 'simple', label: 'Simple', description: 'Basic implementation' },
    { value: 'medium', label: 'Medium', description: 'Standard business logic' },
    { value: 'complex', label: 'Complex', description: 'Advanced enterprise features' }
  ]

  return (
    <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">SAP Code Generator</h3>
          <p className="text-gray-400">Generate SAP code from business requirements</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Requirement Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Requirement
          </label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe your business requirement in detail. For example: 'Create a custom report that shows sales data by region with filters for date range and product category...'"
            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />
          <div className="text-xs text-gray-400 mt-1">
            {requirement.length}/2000 characters
          </div>
        </div>

        {/* Code Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Code Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {codeTypes.map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="codeType"
                  value={type.value}
                  checked={codeType === type.value}
                  onChange={(e) => setCodeType(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border transition-all ${
                  codeType === type.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}>
                  <div className="font-medium text-white">{type.label}</div>
                  <div className="text-sm text-gray-400">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Complexity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Complexity Level
          </label>
          <div className="flex space-x-3">
            {complexityLevels.map((level) => (
              <label key={level.value} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="complexity"
                  value={level.value}
                  checked={complexity === level.value}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="sr-only"
                />
                <div className={`p-3 rounded-lg border text-center transition-all ${
                  complexity === level.value
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}>
                  <div className="font-medium text-white text-sm">{level.label}</div>
                  <div className="text-xs text-gray-400">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeComments}
              onChange={(e) => setIncludeComments(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
              includeComments
                ? 'border-green-500 bg-green-500'
                : 'border-white/30'
            }`}>
              {includeComments && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-white">Include detailed comments and documentation</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!requirement.trim() || isGenerating}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Code...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Generate SAP Code
            </>
          )}
        </button>
      </div>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-white">Generated Code</h4>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-gray-600/50 text-white rounded text-sm hover:bg-gray-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>

          {/* Code Block */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-white/5">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{generatedCode.code}</code>
            </pre>
          </div>

          {/* Code Explanation */}
          {generatedCode.explanation && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h5 className="text-blue-300 font-medium mb-2">Code Explanation</h5>
              <p className="text-gray-300 text-sm leading-relaxed">{generatedCode.explanation}</p>
            </div>
          )}

          {/* Implementation Notes */}
          {generatedCode.notes && generatedCode.notes.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h5 className="text-yellow-300 font-medium mb-2">Implementation Notes</h5>
              <ul className="text-gray-300 text-sm space-y-1">
                {generatedCode.notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CodeGenerator