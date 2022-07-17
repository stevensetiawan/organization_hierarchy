const organization_model = require('../organization-tree.json')

module.exports = {
  getAllEmployees(req, res, next) {
    try {
      if (organization_model) {
        for (let i of organization_model) {
          i.status = 'active'
          if (i.directReports) {
            delete i.directReports
          }
          for (let j of organization_model) {
            if (i.managerId === j.employeeId) {
              i.manager = {
                employeeId: j.employeeId,
                name: j.name,
                status: 'active'
              }
            }
          }
        }
        let result = organization_model.map(({
          employeeId,
          name,
          status,
          manager
        }) => ({
          employeeId,
          name,
          status,
          manager
        }))
        return res.status(200).json(result)
      } else {
        throw err
      }
    } catch (err) {
      return res.status(500).json(err.message)
    }
  },
  getEmployee(req, res, next) {
    try {
      if (isNaN(req.params.id)) {
        return res.status(400).json('Invalid employeeId')
      }

      if (organization_model) {
        for (let i of organization_model) {
          if (i.employeeId == req.params.id) {
            i.status = 'active'
            for (let k of organization_model) {
              if (i.managerId === k.employeeId) {
                i.manager = {
                  employeeId: k.employeeId,
                  name: k.name,
                  status: 'active'
                }
              }
            }
            if (req.query.includeReportingTree) {
              if (req.query.includeReportingTree === 'true') {
                i.directReports = []
                for (let j of organization_model) {
                  if (i.employeeId === j.managerId) {
                    i.directReports.push({
                      employeeId: j.employeeId,
                      name: j.name,
                      status: 'active'
                    })
                  }
                }
                return res.status(200).json({
                  employeeId: i.employeeId,
                  name: i.name,
                  status: i.status,
                  manager: i.manager,
                  directReports: i.directReports
                })
              } else {
                return res.status(200).json({
                  employeeId: i.employeeId,
                  name: i.name,
                  status: i.status,
                  manager: i.manager
                })
              }
            } else {
              return res.status(200).json({
                employeeId: i.employeeId,
                name: i.name,
                status: i.status,
                manager: i.manager
              })
            }
          }
        }
        return res.status(404).json('Employee not found')
      } else {
        throw err
      }
    } catch (err) {
      return res.status(500).json(err.message)
    }
  },
  addEmployee(req, res, next) {
    try {
      if (!req.body.name || !req.body.managerId) {
        return res.status(400).json('Invalid employee object')
      }

      if (isNaN(req.body.managerId)) {
        return res.status(400).json('Invalid managerId')
      }

      if (typeof req.body.managerId !== 'number') {
        return res.status(400).json('managerId must be a number')
      }

      let data = {
        name: req.body.name.trim(),
        managerId: req.body.managerId
      }

      if (data.name === '') {
        return res.status(400).json(`Name must be filled and can't be empty`)
      } else if (data.managerId === '') {
        return res.status(400).json(`ManagerId must be filled and can't be empty`)
      }

      if (!organization_model.some(el => el.employeeId == data.managerId)) {
        return res.status(400).json('Manager is not found')
      }

      let id = 0

      if (organization_model.length > 0) {
        id = organization_model[organization_model.length - 1].employeeId + 1
      }

      let result = {
        employeeId: id,
        name: data.name,
        managerId: data.managerId
      }

      organization_model.push(result)

      return res.status(201).json(`${result.employeeId} is created`)

    } catch (err) {
      return res.status(500).json(err.message)
    }
  },
  updateEmployee(req, res, next) {
    try {
      if (isNaN(req.params.id)) {
        return res.status(400).json('Invalid employeeId')
      }

      if (!req.body.name || !req.body.managerId) {
        return res.status(400).json('Invalid employee object')
      }

      if (isNaN(req.body.managerId)) {
        return res.status(400).json('Invalid managerId')
      }

      if (typeof req.body.managerId !== 'number') {
        return res.status(400).json('managerId must be a number')
      }

      let data = {
        name: req.body.name.trim(),
        managerId: req.body.managerId
      }

      if (data.name === '') {
        return res.status(400).json(`Name must be filled and can't be empty`)
      } else if (data.managerId === '') {
        return res.status(400).json(`ManagerId must be filled and can't be empty`)
      }

      if (data.managerId == req.params.id) {
        return res.status(400).json(`Employee Id ${req.params.id} and Manager Id ${data.managerId} are not allowed to be same`)
      }

      if (organization_model) {
        for (let i of organization_model) {
          if (i.employeeId == req.params.id) {
            for (let k of organization_model) {
              if (data.managerId === k.employeeId) {
                i.name = data.name,
                  i.managerId = data.managerId
                return res.status(200).json(`${i.employeeId} is updated`)
              }
            }
            return res.status(404).json('Manager is not found')
          }
        }
        return res.status(404).json('Employee is not found')
      } else {
        throw err
      }
    } catch (err) {
      return res.status(500).json(err.message)
    }
  },
  deleteEmployee(req, res, next) {
    try {
      if (isNaN(req.params.id)) {
        return res.status(400).json('Invalid employeeId')
      }

      if (organization_model) {
        for (let i of organization_model) {
          if (i.employeeId == req.params.id) {
            for (let k of organization_model) {
              if (k.managerId === i.employeeId) {
                return res.status(404).json(`The employee must not have a direct report!`)
              }
            }
            organization_model.splice(organization_model.findIndex(data => data.employeeId === i.employeeId), 1)
            return res.status(200).json(`Employee Id ${i.employeeId} is successfully deleted!`)
          }
        }
        return res.status(404).json('Employee is not found')
      } else {
        throw err
      }
    } catch (err) {
      return res.status(500).json(err.message)
    }
  }
}