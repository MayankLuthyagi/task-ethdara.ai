const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const { getProjects, getProjectById, addProject, updateProjectById, deleteProjectById } = require('./project.controller');
const { validateProjectId, validateCreateProject, validateUpdateProject } = require('./project.validation');
const router = express.Router();

router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, validateProjectId, getProjectById);
router.post('/', authMiddleware, validateCreateProject, addProject);
router.put('/:id', authMiddleware, validateProjectId, validateUpdateProject, updateProjectById);
router.delete('/:id', authMiddleware, validateProjectId, deleteProjectById);
module.exports = router;