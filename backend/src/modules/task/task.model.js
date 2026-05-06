const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required : true
        },
        detail: {
            type: String,
            require : true
        }
    }
);
module.exports = mongoose.model('Tasks', 'taskSchema');