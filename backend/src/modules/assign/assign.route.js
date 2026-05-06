const express = require('express');
const { getAllAssignTask, getAllAssignProject, assignTask, assignProject, deleteAssignById} = require('./assign.controller');
const router = express.Router();


router.get('/tasks', authMiddleware, getAllAssignTask);
router.get('/projects', authMiddleware, getAllAssignProject);
router.post('/task', authMiddleware, assignTask);
router.post('/projects', authMiddleware, assignProject);
router.delete('/:id', authMiddleware, deleteAssignById);
module.exports = router;