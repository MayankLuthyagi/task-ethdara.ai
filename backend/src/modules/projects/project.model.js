const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model('Projects', projectSchema);