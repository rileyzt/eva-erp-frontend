// frontend/pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, conversationId, persona, context, isRequirementAnalysis, isCodeGeneration } = req.body

    // Basic validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Transform frontend request to match backend API
    const backendRequest = {
      message,
      sessionId: conversationId || `conv_${Date.now()}`, // Frontend uses conversationId, backend uses sessionId
      persona: persona || 'general',
      context: {
        ...context,
        // Transform frontend flags to backend context.type
        type: isRequirementAnalysis ? 'erp_analysis' : 
              isCodeGeneration ? 'code_generation' : 
              'general_chat'
      }
    }

    // Get backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    
    console.log(`Making request to: ${backendUrl}/api/chat`)
    
    // Make request to backend
    const backendResponse = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendRequest)
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend error:', errorText)
      throw new Error(`Backend responded with status: ${backendResponse.status}`)
    }

    const responseData = await backendResponse.json()

    // Transform backend response to match frontend expectations
    const frontendResponse = {
      message: responseData.response || responseData.content,
      conversationId: responseData.sessionId || conversationId,
      persona: persona,
      timestamp: new Date().toISOString()
    }

    // Add analysis data if present (for ERP analysis)
    if (responseData.analysis) {
      frontendResponse.analysis = responseData.analysis
    }

    // Add generated code if present (for code generation)
    if (responseData.code) {
      frontendResponse.generatedCode = {
        code: responseData.code,
        explanation: responseData.explanation,
        documentation: responseData.documentation,
        testCases: responseData.testCases
      }
    }

    // Add suggestions if present
    if (responseData.suggestions) {
      frontendResponse.suggestions = responseData.suggestions
    }

    // Add metadata if present
    if (responseData.metadata) {
      frontendResponse.metadata = responseData.metadata
    }

    res.status(200).json(frontendResponse)

  } catch (error) {
    console.error('Frontend Chat API Error:', error)
    
    // Check if it's a network/connection error
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
      return res.status(503).json({ 
        error: 'Backend service unavailable',
        message: 'Unable to connect to EVA backend service. Please check if the backend container is running.'
      })
    }

    // Generic error response
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process your request. Please try again.'
    })
  }
}

// Configure body parser for larger payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}