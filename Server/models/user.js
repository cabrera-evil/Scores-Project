const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        default: 'USER_ROLE'
    },
    career:{
        type: String,
        require: true
    },
    career_id:{
        type: String,
        require: true
    },
    cum:{
        type: Number,
        default: 0
    },
    subjects:{
        type: Array,
        id:{
            type: String,
            required: true
        },
        name:{
            type: String,
            require: true
        },
        uv:{
            type: Number,
            require: true
        },
        year:{
            type: Number,
            require: true
        },
        average:{
            type: Number,
            default: 0
        },
        approved:{
            type: Boolean,
            default: false
        },
        current:{
            type: Boolean,
            default: true
        },
        times:{
            type: Number,
            default: 1
        },
        evaluations:{
            type: Array,
            id:{
                type: String,
                required: true
            },
            subject_id:{
                type: String,
                require: true
            },
            name:{
                type: String,
                require: true
            },
            percentage:{
                type: Number,
                default: 0
            },
            grade:{
                type: Number,
                default: 0
            },
            default: []
        },
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);