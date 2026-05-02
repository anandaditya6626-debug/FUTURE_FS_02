const jwt       = require('jsonwebtoken')
const User      = require('../models/User')
const Workspace = require('../models/Workspace')
const { v4: uuidv4 } = require('uuid')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, workspaceName } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const workspace = await Workspace.create({ name: workspaceName || `${name}'s Workspace`, ownerId: 'temp', members: [] })
    const user = await User.create({ name, email, password, role: 'admin', workspaceId: workspace._id })
    workspace.ownerId = user._id
    workspace.members.push({ userId: user._id, role: 'admin' })
    workspace.apiKey = `vl_live_${uuidv4().replace(/-/g, '').slice(0, 24)}`
    await workspace.save()

    const token = signToken(user._id)
    res.status(201).json({ user, token, workspace })
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    if (global.DEMO_MODE) {
      const demoStore = require('../utils/demoStore')
      // For demo mode, we accept 'demo@veloracrm.com' / 'demo1234'
      if (email === 'demo@veloracrm.com' && password === 'demo1234') {
        const user = demoStore.findOne('users', { email: 'demo@veloracrm.com' })
        const workspace = demoStore.findById('workspaces', user.workspaceId)
        const token = signToken(user._id)
        return res.json({ user, token, workspace })
      }
      return res.status(401).json({ message: 'Invalid demo credentials. Use demo@veloracrm.com / demo1234' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ message: 'Invalid credentials' })

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    const workspace = await Workspace.findById(user.workspaceId)
    const token = signToken(user._id)
    res.json({ user, token, workspace })
  } catch (err) { next(err) }
}

exports.getMe = async (req, res) => {
  const workspace = await Workspace.findById(req.user.workspaceId)
  res.json({ user: req.user, workspace })
}

exports.logout = (req, res) => res.json({ message: 'Logged out' })
