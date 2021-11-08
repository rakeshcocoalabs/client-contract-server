const express = require('express')
const router = express.Router()
const controller = require('../controllers/clients')
//listProject

var multer = require('multer');
var crypto = require('crypto');
var mime = require('mime-types');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './files')
    },
     filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + "." + mime.extension(file.mimetype))
        })
    }
  })
   
  var upload = multer({ storage: storage })









router.post('/add-client', controller.add)
router.post('/add-project', upload.single('file'),controller.addProject)
router.post('/add-project-milestone/:id', upload.single('file'),controller.addProjectMilestone)
router.get('/list-project', controller.listProject)
router.get('/list-clients', controller.listClients)
router.get('/get-client/:name', controller.getClient)
router.post('/add-invoice', controller.addInvoice)
router.post('/add-invoice-line', controller.addInvoiceLine)
router.post('/make-pdf', controller.makePdf)
router.patch('/update-client/:id', controller.updateClient)
router.get('/get-pdf', controller.download)

module.exports = router