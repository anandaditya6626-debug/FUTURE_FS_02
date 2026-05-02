const router  = require('express').Router()
const protect = require('../middleware/auth')

router.use(protect)
router.get('/stages', (req, res) => res.json({ stages: ['New','Qualified','Proposal','Negotiation','Won','Lost'] }))
router.get('/',       (req, res) => res.json({ pipelines: [] }))
router.post('/move',  (req, res) => res.json({ message: 'Card moved' }))

module.exports = router
