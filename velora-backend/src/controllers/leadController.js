const Lead     = require('../models/Lead')
const aiEngine = require('../utils/aiEngine')

exports.getAll = async (req, res, next) => {
  try {
    const { status, source, search, page = 1, limit = 50 } = req.query

    if (global.DEMO_MODE) {
      const demoStore = require('../utils/demoStore')
      let leads = [...demoStore.get('leads')]
      if (status) leads = leads.filter(l => l.status === status)
      if (search) leads = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))
      return res.json({ leads, total: leads.length, page: 1, pages: 1 })
    }

    const filter = { workspaceId: req.user.workspaceId }
    if (status) filter.status = status
    if (source) filter.source = source
    if (search) filter.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ]
    const [leads, total] = await Promise.all([
      Lead.find(filter).populate('assignedTo', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Lead.countDocuments(filter),
    ])
    res.json({ leads, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) { next(err) }
}

exports.getOne = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId })
      .populate('assignedTo', 'name email').populate('timeline.by', 'name')
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    res.json({ lead })
  } catch (err) { next(err) }
}

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, workspaceId: req.user.workspaceId }
    data.score = aiEngine.calculateLeadScore(data)
    const lead = await Lead.create(data)
    req.app.get('io')?.to(String(req.user.workspaceId)).emit('lead:created', lead)
    res.status(201).json({ lead })
  } catch (err) { next(err) }
}

exports.update = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { ...req.body, score: aiEngine.calculateLeadScore(req.body) },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email')
    if (!lead) return res.status(404).json({ message: 'Lead not found' })
    req.app.get('io')?.to(String(req.user.workspaceId)).emit('lead:updated', lead)
    res.json({ lead })
  } catch (err) { next(err) }
}

exports.remove = async (req, res, next) => {
  try {
    await Lead.findOneAndDelete({ _id: req.params.id, workspaceId: req.user.workspaceId })
    res.json({ message: 'Lead deleted' })
  } catch (err) { next(err) }
}

exports.bulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body
    await Lead.deleteMany({ _id: { $in: ids }, workspaceId: req.user.workspaceId })
    res.json({ message: `${ids.length} leads deleted` })
  } catch (err) { next(err) }
}

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { ids, data } = req.body
    await Lead.updateMany({ _id: { $in: ids }, workspaceId: req.user.workspaceId }, data)
    res.json({ message: `${ids.length} leads updated` })
  } catch (err) { next(err) }
}

exports.addNote = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { $push: { notes: { text: req.body.text, author: req.user._id, authorName: req.user.name } } },
      { new: true }
    )
    res.json({ lead })
  } catch (err) { next(err) }
}

exports.addFollowup = async (req, res, next) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { $push: { followUps: req.body } },
      { new: true }
    )
    res.json({ lead })
  } catch (err) { next(err) }
}

exports.exportCSV = async (req, res, next) => {
  try {
    const leads = await Lead.find({ workspaceId: req.user.workspaceId }).lean()
    const headers = ['name','email','phone','source','status','score','dealValue','createdAt']
    const rows = leads.map((l) => headers.map((h) => `"${l[h] || ''}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
    res.send(csv)
  } catch (err) { next(err) }
}
