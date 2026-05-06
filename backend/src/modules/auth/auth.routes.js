const express = require('express');
const { addUser, signIn } = require('./auth.controller');

const router = express.Router();

router.post('/users', addUser);
router.post('/login', signIn);
module.exports = router;