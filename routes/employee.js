const router = require('express').Router()
const employee = require('../controllers/employee')

router.get('/', employee.getAllEmployees)
router.get('/:id', employee.getEmployee)
router.post('/', employee.addEmployee)
router.put('/:id', employee.updateEmployee)
router.delete('/:id', employee.deleteEmployee)

module.exports = router