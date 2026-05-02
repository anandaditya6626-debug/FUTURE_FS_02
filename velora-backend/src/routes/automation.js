const router     = require('express').Router()
const protect    = require('../middleware/auth')
const Automation = require('../models/Automation')

router.use(protect)

router.get('/', async (req, res, next) => {
  try {
    const automations = await Automation.find({ workspaceId: req.user.workspaceId }).sort({ createdAt: -1 })
    res.json({ automations })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const automation = await Automation.create({ ...req.body, workspaceId: req.user.workspaceId })
    res.status(201).json({ automation })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const automation = await Automation.findOneAndUpdate({ _id: req.params.id, workspaceId: req.user.workspaceId }, req.body, { new: true })
    res.json({ automation })
  } catch (err) { next(err) }
})

router.post('/:id/toggle', async (req, res, next) => {
  try {
    const automation = await Automation.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId })
    automation.isActive = !automation.isActive
    await automation.save()
    res.json({ automation })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Automation.findOneAndDelete({ _id: req.params.id, workspaceId: req.user.workspaceId })
    res.json({ message: 'Automation deleted' })
  } catch (err) { next(err) }
})

module.exports = router
