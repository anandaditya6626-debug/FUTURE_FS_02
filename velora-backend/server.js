require('dotenv').config()
const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
const helmet     = require('helmet')
const morgan     = require('morgan')
const http       = require('http')
const { Server } = require('socket.io')
const logger     = require('./src/utils/logger')
const errorHandler = require('./src/middleware/errorHandler')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, { cors: { origin: process.env.CLIENT_URL, credentials: true } })

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// ── Socket.io ─────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`)
  socket.on('join-workspace', (workspaceId) => socket.join(workspaceId))
  socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`))
})
app.set('io', io)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',           require('./src/routes/auth'))
app.use('/api/leads',          require('./src/routes/leads'))
app.use('/api/pipeline',       require('./src/routes/pipeline'))
app.use('/api/analytics',      require('./src/routes/analytics'))
app.use('/api/tasks',          require('./src/routes/tasks'))
app.use('/api/workspace',      require('./src/routes/workspace'))
app.use('/api/automation',     require('./src/routes/automation'))
app.use('/api/communications', require('./src/routes/communications'))
app.use('/api/ai',             require('./src/routes/ai'))
app.use('/api/public',         require('./src/routes/public'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0', timestamp: new Date() }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler)

// ── DB + Start ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    logger.info('MongoDB connected')
    // Seed demo data if DB is empty
    const { seedDemo } = require('./src/utils/seedData')
    await seedDemo()
    server.listen(PORT, () => logger.info(`VeloraCRM API running on port ${PORT}`))
  })
  .catch((err) => {
    logger.error('MongoDB connection failed:', err.message)
    logger.warn('Starting server in DEMO MODE (In-memory storage)')
    global.DEMO_MODE = true
    server.listen(PORT, () => logger.info(`VeloraCRM API running on port ${PORT} (DEMO MODE)`))
  })

module.exports = { app, io }
