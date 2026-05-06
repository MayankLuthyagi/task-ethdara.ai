const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/projects',projectRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API Running'
    });
})
module.exports = app;