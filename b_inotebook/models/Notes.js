const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: String,
        default: Date.now
    }
});

const notes = mongoose.model('notes', noteSchema);

module.exports = notes;