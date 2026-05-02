const aiEngine = require('../utils/aiEngine')
const Lead     = require('../models/Lead')

exports.chat = async (req, res, next) => {
  try {
    const { messages } = req.body
    const reply = aiEngine.chat(messages)
    res.json({ reply, role: 'assistant' })
  } catch (err) { next(err) }
}

exports.summarize = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.body.leadId, workspaceId: req.user.workspaceId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.json({ summary: aiEngine.summarizeLead(lead) })
  } catch (err) { next(err) }
}

exports.generateReply = async (req, res, next) => {
  try {
    const { leadId, tone } = req.body
    const lead = leadId ? await Lead.findById(leadId) : { name: 'there' }
    res.json({ reply: aiEngine.generateReply(lead || { name: 'there' }, tone) })
  } catch (err) { next(err) }
}

exports.predict = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.body.leadId, workspaceId: req.user.workspaceId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.json({
      score: aiEngine.calculateLeadScore(lead),
      conversionProbability: aiEngine.predictConversion(lead),
      nextActions: aiEngine.getNextBestAction(lead),
    })
  } catch (err) { next(err) }
}

exports.nextAction = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.body.leadId, workspaceId: req.user.workspaceId })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.json({ actions: aiEngine.getNextBestAction(lead) })
  } catch (err) { next(err) }
}
