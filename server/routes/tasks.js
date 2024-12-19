
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


router.get('/search', async (req, res) => {
  const { taskName, assigneeName, dueDate, status, priority, page = 1, limit = 10 } = req.query;
  let filter = {};

  if (taskName) filter.taskName = new RegExp(taskName, 'i');
  if (assigneeName) filter.assigneeName = new RegExp(assigneeName, 'i');
  if (dueDate) filter.dueDate = { $eq: new Date(dueDate) };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  try {
    const tasks = await Task.find(filter)
      .select('taskName assigneeName dueDate status priority')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Task.countDocuments(filter);
    res.json({ tasks, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});



router.post('/tasks', async (req, res) => {
  const { taskName, assigneeName, dueDate, status, priority } = req.body;

  try {
    const newTask = new Task({ taskName, assigneeName, dueDate, status, priority });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});


router.put('/:id', async (req, res) => {
  const { taskName, assigneeName, dueDate, status, priority } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { taskName, assigneeName, dueDate, status, priority },
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
