const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeRoles = require('../../middleware/role.middleware');
const { getUsers, getMyProfile, updateUser, deleteUser } = require('./user.controller');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin'), getUsers);
router.get('/me', authMiddleware, authorizeRoles('admin', 'member'), getMyProfile);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateUser);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteUser);

module.exports = router;
