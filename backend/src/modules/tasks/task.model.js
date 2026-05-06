const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Projects',
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'overdue'],
            default: 'pending'
        },
        dueDate: {
            type: Date
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model('Tasks', taskSchema);