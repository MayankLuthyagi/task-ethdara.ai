const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const { getTasks, getTaskById, addTask, updateTaskById, deleteTaskById} = require('./task.controller');
const router = express.Router();


router.get('/', authMiddleware, getTasks );
router.get('/:id', authMiddleware, getTaskById);
router.post('/', authMiddleware, addTask);
router.put('/:id', authMiddleware, updateTaskById);
router.delete('/:id', authMiddleware, deleteTaskById);
module.exports = router;