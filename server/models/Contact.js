const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    participation:{
        type: String,
        enum: ['member', 'donor', 'simp'],
        required: true
    }
},{timestamps: true}
);3

module.exports = mongoose.model('Contact', contactSchema);