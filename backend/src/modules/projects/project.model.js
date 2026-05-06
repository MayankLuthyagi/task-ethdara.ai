const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema(
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
module.exports = mongoose.model('Projects', 'projectSchema');