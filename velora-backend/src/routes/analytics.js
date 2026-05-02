const router  = require('express').Router()
const protect = require('../middleware/auth')
const ctrl    = require('../controllers/analyticsController')

router.use(protect)
router.get('/dashboard', ctrl.getDashboard)
router.get('/funnel',    ctrl.getFunnel)
router.get('/revenue',   ctrl.getRevenue)
router.get('/team',      ctrl.getTeamPerformance)

module.exports = router
