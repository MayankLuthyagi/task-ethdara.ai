const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeRoles = require('../../middleware/role.middleware');
const {
    getAllAssignedTasks,
    getAssignedTasksByUser,
    assignTask,
    updateTaskAssignById,
    deleteTaskAssignById,
    getMyTasks,
    updateMyTaskStatus
} = require('./taskAssign.controller');

const router = express.Router();

router.get('/', authMiddleware, authorizeRoles('admin', 'moderator'), getAllAssignedTasks);

router.get('/user/:userId', authMiddleware, authorizeRoles('admin', 'moderator'), getAssignedTasksByUser);

router.post('/', authMiddleware, authorizeRoles('admin', 'moderator'), assignTask);

router.put('/:id', authMiddleware, authorizeRoles('admin', 'moderator'), updateTaskAssignById);

router.delete('/:id', authMiddleware, authorizeRoles('admin', 'moderator'), deleteTaskAssignById);

router.get('/my-tasks/list', authMiddleware, authorizeRoles('member'), getMyTasks);

router.patch('/my-tasks/:id/status', authMiddleware, authorizeRoles('member'), updateMyTaskStatus);

module.exports = router;
