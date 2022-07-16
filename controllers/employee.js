const organization_model = require('../organization-tree.json')


module.exports = {
  getAllEmployees(req, res, next) {
    try {
      if (organization_model) {
        for (let i of organization_model) {
          i.status = 'active'
          for (let j of organization_model) {
            if (i.managerId === j.employeeId) {
              i.manager = {
                employeeId: j.employeeId,
                name: j.name,
                status: 'active'
              }
            }
          }
          i.directReports = []
        }
        return res.status(200).json(organization_model)
      } else {
        throw err
      }
    } catch (err) {
      return res.status(500).json(err.message)
    }
  },
  getEmployee(req, res, next) {
    try {
      if(isNaN(req.params.id)){
        return res.status(400).json('Invalid employeeId')
      }

      if (organization_model) {
        for (let i of organization_model) {
          if (i.employeeId == req.params.id) {
            i.status = 'active'
            for (let k of organization_model) {
              if (i.managerId == k.employeeId) {
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
                  if (i.employeeId == j.managerId) {
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
}