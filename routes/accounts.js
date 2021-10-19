const express = require('express')
const router = express.Router()
const Alien = require('../models/alien')
const controller = require('../controllers/accounts')
const auth = require('../middleware/auth')
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





router.post('/register',upload.single('image'), controller.register)
router.post('/login', controller.login)
router.get('/info',auth, controller.info)


module.exports = router