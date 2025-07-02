import multer from 'multer'
import path from 'path'
import { documentProcessor } from '../../../backend/services/documentProcessor.js'
import { validateFileUpload } from '../../../backend/utils/validators.js'

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'backend/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /\.(pdf|doc|docx|txt|xlsx|xls|csv)$/i
    const isAllowed = allowedTypes.test(path.extname(file.originalname))
    
    if (isAllowed) {
      return cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, XLSX, XLS, and CSV files are allowed.'))
    }
  }
})

// Disable default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Run multer middleware
    await runMiddleware(req, res, upload.single('document'))

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Validate file
    const fileValidation = validateFileUpload(req.file)
    if (!fileValidation.isValid) {
      return res.status(400).json({ error: fileValidation.error })
    }

    // Process the document
    const processingResult = await documentProcessor.processDocument(req.file)

    if (!processingResult.success) {
      return res.status(500).json({ 
        error: 'Document processing failed',
        message: processingResult.error 
      })
    }

    // Return processed document data
    res.status(200).json({
      success: true,
      fileId: processingResult.fileId,
      filename: req.file.originalname,
      content: processingResult.content,
      analysis: processingResult.analysis,
      metadata: {
        size: req.file.size,
        type: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Upload API Error:', error)
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large',
        message: 'File size must be less than 10MB'
      })
    }

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ 
        error: 'Invalid file type',
        message: error.message
      })
    }

    res.status(500).json({ 
      error: 'Upload failed',
      message: 'Failed to upload and process the document'
    })
  }
}