const router  = require('express').Router()
const protect = require('../middleware/auth')
const ctrl    = require('../controllers/aiController')

router.use(protect)
router.post('/chat',        ctrl.chat)
router.post('/summarize',   ctrl.summarize)
router.post('/reply',       ctrl.generateReply)
router.post('/predict',     ctrl.predict)
router.post('/next-action', ctrl.nextAction)

module.exports = router
