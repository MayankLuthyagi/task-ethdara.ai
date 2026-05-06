const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const projectRoutes = require('./modules/projects/project.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const assignRoutes = require('./modules/assign/assign.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assign', assignRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API Running'
    });
})
module.exports = app;