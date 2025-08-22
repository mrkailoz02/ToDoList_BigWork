const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  date_start: { type: Date, required: true },
  finished: { type: Boolean, default: false },
}, { timestamps: true });

todoSchema.index({ finished: 1, date_start: 1 });

todoSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Todo", todoSchema);
