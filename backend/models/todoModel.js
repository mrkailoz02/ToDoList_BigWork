const mongoose = require('mongoose');


const todoSchema = new mongoose.Schema({
title: { type: String, required: true, trim: true },
date_start: { type: String, required: true }, // เก็บเป็น YYYY-MM-DD
finished: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('Todo', todoSchema);