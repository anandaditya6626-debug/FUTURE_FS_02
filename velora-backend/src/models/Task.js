const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  leadId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate:     { type: Date },
  status:      { type: String, enum: ['todo','in_progress','done'], default: 'todo' },
  priority:    { type: String, enum: ['low','medium','high'], default: 'medium' },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)
