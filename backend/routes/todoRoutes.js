const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/todoModel");
const router = express.Router();

// Get All
router.get("/", async (req, res) => {
  try {
    const { finished, q, page = 1, limit = 5, sortKey = "createdAt", sortOrder = "desc" } = req.query;
    const filter = {};
    if (finished === "true" || finished === "false") filter.finished = finished === "true";
    if (q) filter.name = { $regex: q, $options: "i" };
    const skip = (Number(page) - 1) * Number(limit);
    const sort = {};
    sort[sortKey] = sortOrder === "asc" ? 1 : -1;
    const [items, total] = await Promise.all([
      Todo.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Todo.countDocuments(filter)
    ]);
    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get By ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const { name, date_start, finished } = req.body;
    const todo = new Todo({ name, date_start: date_start ? new Date(date_start) : undefined, finished });
    const saved = await todo.save();
    res.status(201).json(saved.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });

    const update = { ...req.body };
    if (update.date_start) update.date_start = new Date(update.date_start);

    const updated = await Todo.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid id" });
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
