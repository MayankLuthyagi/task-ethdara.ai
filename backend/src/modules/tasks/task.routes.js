const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const authorizeRoles = require('../../middleware/role.middleware');
const { getTasks, getTaskById, addTask, updateTaskById, deleteTaskById } = require('./task.controller');
const { validateTaskId, validateCreateTask, validateUpdateTask } = require('./task.validation');
const router = express.Router();


router.get('/', authMiddleware, authorizeRoles('admin', 'member'), getTasks);
router.get('/:id', authMiddleware, authorizeRoles('admin', 'member'), validateTaskId, getTaskById);
router.post('/', authMiddleware, authorizeRoles('admin'), validateCreateTask, addTask);
router.put('/:id', authMiddleware, authorizeRoles('admin'), validateTaskId, validateUpdateTask, updateTaskById);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), validateTaskId, deleteTaskById);
module.exports = router;