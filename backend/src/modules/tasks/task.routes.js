const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const { getTasks, getTaskById, addTask, updateTaskById, deleteTaskById } = require('./task.controller');
const { validateTaskId, validateCreateTask, validateUpdateTask } = require('./task.validation');
const router = express.Router();


router.get('/', authMiddleware, getTasks);
router.get('/:id', authMiddleware, validateTaskId, getTaskById);
router.post('/', authMiddleware, validateCreateTask, addTask);
router.put('/:id', authMiddleware, validateTaskId, validateUpdateTask, updateTaskById);
router.delete('/:id', authMiddleware, validateTaskId, deleteTaskById);
module.exports = router;