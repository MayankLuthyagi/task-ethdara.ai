const mongoose = require('mongoose');

const taskAssignSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        task_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        deadline: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('TaskAssign', taskAssignSchema);
