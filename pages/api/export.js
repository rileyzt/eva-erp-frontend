import { conversationMemory } from '../../../backend/services/conversationMemory.js'
import { exportHelpers } from '../../../backend/utils/exportHelpers.js'
import { validateExportRequest } from '../../../backend/utils/validators.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { conversationId, format, includeAnalysis, includeCode, title } = req.body

    // Validate input
    const validation = validateExportRequest(req.body)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error })
    }

    // Get conversation data
    const conversation = conversationMemory.getConversation(conversationId)
    
    if (!conversation || conversation.messages.length === 0) {
      return res.status(404).json({ error: 'Conversation not found or empty' })
    }

    let exportData
    let contentType
    let filename

    switch (format) {
      case 'pdf':
        exportData = await exportHelpers.generatePDF(conversation, {
          includeAnalysis,
          includeCode,
          title
        })
        contentType = 'application/pdf'
        filename = `eva-consultation-${conversationId}.pdf`
        break

      case 'docx':
        exportData = await exportHelpers.generateDOCX(conversation, {
          includeAnalysis,
          includeCode,
          title
        })
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        filename = `eva-consultation-${conversationId}.docx`
        break

      case 'json':
        exportData = exportHelpers.generateJSON(conversation, {
          includeAnalysis,
          includeCode,
          title
        })
        contentType = 'application/json'
        filename = `eva-consultation-${conversationId}.json`
        break

      case 'txt':
        exportData = exportHelpers.generateTXT(conversation, {
          includeAnalysis,
          includeCode,
          title
        })
        contentType = 'text/plain'
        filename = `eva-consultation-${conversationId}.txt`
        break

      default:
        return res.status(400).json({ error: 'Unsupported export format' })
    }

    // Set response headers for file download
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    
    if (format === 'json') {
      res.setHeader('Content-Length', Buffer.byteLength(JSON.stringify(exportData)))
      return res.status(200).json(exportData)
    } else {
      res.setHeader('Content-Length', exportData.length)
      return res.status(200).send(exportData)
    }

  } catch (error) {
    console.error('Export API Error:', error)
    res.status(500).json({ 
      error: 'Export failed',
      message: 'Failed to export consultation data'
    })
  }
}

// Handle export metadata request
export async function exportMetadata(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { conversationId } = req.query

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' })
    }

    const conversation = conversationMemory.getConversation(conversationId)
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    // Calculate export metadata
    const metadata = {
      messageCount: conversation.messages.length,
      hasAnalysis: conversation.messages.some(msg => msg.analysis),
      hasCode: conversation.messages.some(msg => msg.generatedCode),
      personas: [...new Set(conversation.messages
        .filter(msg => msg.persona)
        .map(msg => msg.persona))],
      duration: {
        start: conversation.createdAt,
        end: conversation.messages[conversation.messages.length - 1]?.timestamp || conversation.createdAt
      },
      estimatedExportSizes: {
        txt: Math.ceil(JSON.stringify(conversation).length * 0.8),
        json: JSON.stringify(conversation).length,
        pdf: Math.ceil(JSON.stringify(conversation).length * 1.5),
        docx: Math.ceil(JSON.stringify(conversation).length * 1.2)
      }
    }

    res.status(200).json(metadata)

  } catch (error) {
    console.error('Export Metadata Error:', error)
    res.status(500).json({ 
      error: 'Failed to get export metadata' 
    })
  }
}