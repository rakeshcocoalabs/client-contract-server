const express = require('express')
const router = express.Router()
const controller = require('../controllers/clients')
//listProject










router.post('/add-client', controller.add)
router.post('/add-project', controller.addProject)
router.get('/list-project', controller.listProject)


module.exports = router