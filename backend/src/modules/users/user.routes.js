const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeRoles = require('../../middleware/role.middleware');
const { getUsers, getMyProfile } = require('./user.controller');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin'), getUsers);
router.get('/me', authMiddleware, authorizeRoles('admin', 'member'), getMyProfile);

module.exports = router;
