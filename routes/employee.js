const router = require('express').Router()
const employee = require('../controllers/employee')

router.get('/', employee.getAllEmployees)
router.get('/:id', employee.getEmployee)
//router.get('/:id?includingReportingTree', employee.getEmployee)

module.exports = router