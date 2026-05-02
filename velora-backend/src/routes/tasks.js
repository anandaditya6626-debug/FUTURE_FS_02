const router  = require('express').Router()
const protect = require('../middleware/auth')
const Task    = require('../models/Task')

router.use(protect)

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find({ workspaceId: req.user.workspaceId }).populate('assignedTo','name').sort({ dueDate: 1 })
    res.json({ tasks })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, workspaceId: req.user.workspaceId })
    res.status(201).json({ task })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, workspaceId: req.user.workspaceId }, req.body, { new: true })
    res.json({ task })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, workspaceId: req.user.workspaceId })
    res.json({ message: 'Task deleted' })
  } catch (err) { next(err) }
})

module.exports = router
