const router  = require('express').Router()
const protect = require('../middleware/auth')

const logs = []

router.use(protect)
router.get('/', (req, res) => res.json({ logs }))
router.post('/', (req, res) => { logs.unshift({ ...req.body, id: Date.now(), userId: req.user._id }); res.status(201).json({ log: logs[0] }) })
router.get('/templates', (req, res) => res.json({ templates: [
  { name:'Follow-up Email', type:'email', body:'Hi {{name}}, following up on our last conversation...' },
  { name:'Intro WhatsApp',  type:'whatsapp', body:'Hey {{name}}! 👋 Thought VeloraCRM could be a great fit...' },
  { name:'Demo Invite',     type:'email', body:'Hi {{name}}, I\'d love to show you VeloraCRM live. Would {{date}} work?' },
]}))
router.post('/templates', (req, res) => res.status(201).json({ template: req.body }))

module.exports = router
