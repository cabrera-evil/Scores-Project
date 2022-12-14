const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    careers: {
        type: Array,
        id:{
            type: String,
            required: true
        },
        name: {
            type: String,
            require: true
        },
        subjects: {
            type: Array,
            id:{
                type: String,
                required: true
            },
            career_id:{
                type: String,
                required: true
            },
            name: {
                type: String,
                require: true
            },
            uv: {
                type: Number,
                required: true
            },
            year:{
                type: Number,
                required: true
            },
            default: []
        }
    }
});

module.exports = mongoose.model('Faculty', facultySchema);