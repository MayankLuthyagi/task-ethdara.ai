const express = require('express');
const { addUser, signIn } = require('./auth.controller');
const { validateSignup, validateLogin } = require('./auth.validation');

const router = express.Router();

router.post('/users', validateSignup, addUser);
router.post('/login', validateLogin, signIn);
module.exports = router;