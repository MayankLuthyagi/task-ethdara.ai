const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const taskAssignRoutes = require('./modules/taskAssign/taskAssign.routes');
const projectAssignRoutes = require('./modules/projectAssign/projectAssign.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const userRoutes = require('./modules/users/user.routes');
const errorMiddleware = require('./middleware/error.middleware');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-assign', taskAssignRoutes);
app.use('/api/project-assign', projectAssignRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API Running'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorMiddleware);

module.exports = app;