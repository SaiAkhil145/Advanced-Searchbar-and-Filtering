
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: { type: String, index: true },
  assigneeName: { type: String, index: true },
  dueDate: { type: Date, index: true },
  status: { type: String, index: true },
  priority: { type: String, index: true } 
});

module.exports = mongoose.model('Task', taskSchema);
