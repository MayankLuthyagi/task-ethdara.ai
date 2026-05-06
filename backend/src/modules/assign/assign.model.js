const mongoose = require('mongoose');
const assignSchema = new mongoose.Schema(
    {
        user_id: {
            type: Int16Array,
            required : true
        },
        work_type: {
            type: String,
            enum: ['task', 'project'],
            required : true
        },
        work_id: {
            type: Int16Array,
            required : true
        }
    }
);
module.exports = mongoose.model('Assign', 'assignSchema');