const router     = require('express').Router()
const protect    = require('../middleware/auth')
const Workspace  = require('../models/Workspace')
const User       = require('../models/User')

router.use(protect)

router.get('/', async (req, res, next) => {
  try {
    const ws = await Workspace.findById(req.user.workspaceId).populate('members.userId','name email role')
    res.json({ workspace: ws })
  } catch (err) { next(err) }
})

router.put('/', async (req, res, next) => {
  try {
    const ws = await Workspace.findByIdAndUpdate(req.user.workspaceId, req.body, { new: true })
    res.json({ workspace: ws })
  } catch (err) { next(err) }
})

router.get('/members', async (req, res, next) => {
  try {
    const ws = await Workspace.findById(req.user.workspaceId).populate('members.userId','name email role lastLogin')
    res.json({ members: ws.members })
  } catch (err) { next(err) }
})

router.post('/invite', async (req, res, next) => {
  try {
    const { email, role } = req.body
    let user = await User.findOne({ email })
    if (!user) user = await User.create({ name: email.split('@')[0], email, password: 'Welcome@123', role, workspaceId: req.user.workspaceId })
    await Workspace.findByIdAndUpdate(req.user.workspaceId, { $addToSet: { members: { userId: user._id, role } } })
    res.json({ message: 'Invite sent', user })
  } catch (err) { next(err) }
})

router.put('/members/:userId/role', async (req, res, next) => {
  try {
    await Workspace.updateOne({ _id: req.user.workspaceId, 'members.userId': req.params.userId }, { $set: { 'members.$.role': req.body.role } })
    res.json({ message: 'Role updated' })
  } catch (err) { next(err) }
})

router.delete('/members/:userId', async (req, res, next) => {
  try {
    await Workspace.findByIdAndUpdate(req.user.workspaceId, { $pull: { members: { userId: req.params.userId } } })
    res.json({ message: 'Member removed' })
  } catch (err) { next(err) }
})

module.exports = router
