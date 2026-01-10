const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    recruiterId: {
        type: String,
        required: true,
        index: true
    },
    roleTitle: {
        type: String,
        required: true,
        trim: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
        max: 120,
        default: 15
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);

