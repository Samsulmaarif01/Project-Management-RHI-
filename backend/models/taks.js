const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    Text: {
        type: String,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "done"],
        default: "pending",
    },
    dueDate: {
        type: Date,
        required:true,
    },
    asignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    attachments: [{
        type: string,
    }],
    todoChecklist: {
        todoSchema
    },
    progress: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);