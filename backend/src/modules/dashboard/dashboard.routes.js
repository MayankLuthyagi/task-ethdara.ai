const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const authorizeRoles = require('../../middleware/role.middleware');
const { getDashboardSummary, getMyDashboardSummary } = require('./dashboard.controller');

const router = express.Router();

router.get('/summary', authMiddleware, authorizeRoles('admin', 'moderator'), getDashboardSummary);
router.get('/my-summary', authMiddleware, getMyDashboardSummary);

module.exports = router;
