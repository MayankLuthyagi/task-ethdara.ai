const mongoose = require('mongoose');

const projectAssignSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        project_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Projects',
            required: true
        },
        role: {
            type: String,
            enum: ['lead', 'member', 'contributor'],
            default: 'member'
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

module.exports = mongoose.model('ProjectAssign', projectAssignSchema);
