import { useState, useEffect } from 'react'

const ExportModal = ({ isOpen, onClose, conversationId, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf')
  const [includeAnalysis, setIncludeAnalysis] = useState(true)
  const [includeCode, setIncludeCode] = useState(true)
  const [title, setTitle] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchMetadata()
    }
  }, [isOpen, conversationId])

  const fetchMetadata = async () => {
    try {
      const response = await fetch(`/api/export?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMetadata(data)
        setTitle(`EVA Consultation - ${new Date().toLocaleDateString()}`)
      }
    } catch (error) {
      console.error('Failed to fetch export metadata:', error)
    }
  }

  const handleExport = async () => {
    if (!conversationId) return

    setIsExporting(true)
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          format: exportFormat,
          includeAnalysis,
          includeCode,
          title: title.trim() || `EVA Consultation - ${new Date().toLocaleDateString()}`
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `eva-consultation.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        onExport?.()
        onClose()
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export consultation. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', description: 'Professional document format' },
    { value: 'docx', label: 'Word Document', description: 'Editable Microsoft Word format' },
    { value: 'txt', label: 'Text File', description: 'Plain text format' },
    { value: 'json', label: 'JSON Data', description: 'Structured data format' }
  ]

  const getEstimatedSize = (format) => {
    if (!metadata?.estimatedExportSizes) return 'Unknown'
    const size = metadata.estimatedExportSizes[format]
    if (size < 1024) return `${size} bytes`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
    return `${Math.round(size / (1024 * 1024))} MB`
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Export Consultation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {metadata && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Consultation Summary</h4>
            <div className="space-y-1 text-sm text-gray-400">
              <div>Messages: {metadata.messageCount}</div>
              {metadata.hasAnalysis && <div>✓ Includes ERP Analysis</div>}
              {metadata.hasCode && <div>✓ Includes Generated Code</div>}
              {metadata.personas.length > 0 && (
                <div>Consultants: {metadata.personas.join(', ')}</div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter document title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Export Format
            </label>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={exportFormat === option.value}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex-1 p-3 rounded-lg border transition-all ${
                    exportFormat === option.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{option.label}</div>
                        <div className="text-sm text-gray-400">{option.description}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        ~{getEstimatedSize(option.value)}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeAnalysis}
                onChange={(e) => setIncludeAnalysis(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                includeAnalysis
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-white/30'
              }`}>
                {includeAnalysis && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white">Include ERP Analysis Results</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeCode}
                onChange={(e) => setIncludeCode(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                includeCode
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-white/30'
              }`}>
                {includeCode && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white">Include Generated Code</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600/50 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              'Export'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal