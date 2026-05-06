const express = require('express');
const { getProjects } = require('./project.controller');
const router = express.Router();


router.get('/', authMiddleware, getProjects );

module.exports = router;