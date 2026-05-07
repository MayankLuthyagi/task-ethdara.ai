const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeRoles = require('../../middleware/role.middleware');
const {
    getAllAssignedProjects,
    getAssignedProjectsByUser,
    getProjectMembers,
    assignProject,
    updateProjectAssignById,
    deleteProjectAssignById,
    getMyProject,
    updateMyProject
} = require('./projectAssign.controller');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin'), getAllAssignedProjects);

router.get('/user/:userId', authMiddleware, authorizeRoles('admin'), getAssignedProjectsByUser);

router.get('/project/:projectId', authMiddleware, authorizeRoles('admin'), getProjectMembers);

router.post('/', authMiddleware, authorizeRoles('admin'), assignProject);

router.put('/:id', authMiddleware, authorizeRoles('admin'), updateProjectAssignById);

router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteProjectAssignById);

router.get('/my-project/list', authMiddleware, getMyProject);

router.patch('/my-project/:id/status', authMiddleware, updateMyProject);

module.exports = router;
