const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const { getProjects, getProjectById, addProject, updateProjectById, deleteProjectById } = require('./project.controller');
const router = express.Router();

router.get('/', authMiddleware, getProjects );
router.get('/:id', authMiddleware, getProjectById);
router.post('/', authMiddleware, addProject);
router.put('/:id', authMiddleware, updateProjectById);
router.delete('/:id', authMiddleware, deleteProjectById);
module.exports = router;