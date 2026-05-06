const mongoose = require('mongoose');
const assignSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        work_type: {
            type: String,
            enum: ['task', 'project'],
            required: true
        },
        work_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model('Assign', assignSchema);