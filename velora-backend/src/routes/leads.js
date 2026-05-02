const router = require('express').Router()
const ctrl   = require('../controllers/leadController')
const protect= require('../middleware/auth')

router.use(protect)
router.get('/',           ctrl.getAll)
router.get('/export',     ctrl.exportCSV)
router.post('/',          ctrl.create)
router.post('/bulk-delete', ctrl.bulkDelete)
router.post('/bulk-update', ctrl.bulkUpdate)
router.get('/:id',        ctrl.getOne)
router.put('/:id',        ctrl.update)
router.delete('/:id',     ctrl.remove)
router.post('/:id/notes', ctrl.addNote)
router.post('/:id/followups', ctrl.addFollowup)

module.exports = router
