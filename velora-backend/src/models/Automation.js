const mongoose = require('mongoose')

const automationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  trigger:     { type: String, required: true },
  conditions:  [{ field: String, operator: String, value: mongoose.Schema.Types.Mixed }],
  actions:     [{ type: { type: String }, config: mongoose.Schema.Types.Mixed }],
  delay:       { value: Number, unit: { type: String, enum: ['minutes','hours','days'] } },
  isActive:    { type: Boolean, default: true },
  runs:        { type: Number, default: 0 },
  lastRun:     { type: Date },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
}, { timestamps: true })

module.exports = mongoose.model('Automation', automationSchema)
