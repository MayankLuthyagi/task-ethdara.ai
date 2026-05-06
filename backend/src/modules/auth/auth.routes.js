const express = require('express');
const { addUser } = require('./auth.controller');

const router = express.Router();

router.post('/users', addUser);

module.exports = router;