const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware')
const authorizeRoles = require('../../middleware/role.middleware');
const { getProjects, getProjectById, addProject, updateProjectById, deleteProjectById } = require('./project.controller');
const { validateProjectId, validateCreateProject, validateUpdateProject } = require('./project.validation');
const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin', 'member'), getProjects);
router.get('/:id', authMiddleware, authorizeRoles('admin', 'member'), validateProjectId, getProjectById);
router.post('/', authMiddleware, authorizeRoles('admin'), validateCreateProject, addProject);
router.put('/:id', authMiddleware, authorizeRoles('admin'), validateProjectId, validateUpdateProject, updateProjectById);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), validateProjectId, deleteProjectById);
module.exports = router;