const router  = require('express').Router()
const Lead    = require('../models/Lead')
const aiEngine = require('../utils/aiEngine')

// Public lead capture endpoint — requires API key in header
router.post('/lead', async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey
    if (!apiKey) return res.status(401).json({ message: 'API key required' })

    const Workspace = require('../models/Workspace')
    const workspace = await Workspace.findOne({ apiKey })
    if (!workspace) return res.status(401).json({ message: 'Invalid API key' })

    const data = { ...req.body, workspaceId: workspace._id, source: req.body.source || 'other' }
    data.score = aiEngine.calculateLeadScore(data)
    const lead = await Lead.create(data)
    res.status(201).json({ success: true, leadId: lead._id })
  } catch (err) { next(err) }
})

module.exports = router
