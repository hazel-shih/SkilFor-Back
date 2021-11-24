const express = require('express')
const router = express.Router()
const Members = require('../controller/members')
// const { checkAuth } = require('../middlewares/authHandler')
const {validateRegister, validateLogin} = require('../middlewares/validators/membersValidator');

router.post('/login',validateLogin, Members.login)
router.post('/register',validateRegister , Members.register)
router.get('/me', Members.getInfo)

module.exports = router