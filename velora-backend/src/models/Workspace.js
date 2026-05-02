const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role:   { type: String, enum: ['admin','manager','sales'], default: 'sales' },
  }],
  settings: {
    currency:   { type: String, default: 'INR' },
    timezone:   { type: String, default: 'Asia/Kolkata' },
    industry:   { type: String, default: 'Other' },
  },
  apiKey:    { type: String },
  webhooks:  [{ url: String, events: [String], active: { type: Boolean, default: true } }],
  plan:      { type: String, enum: ['free','pro','enterprise'], default: 'free' },
}, { timestamps: true })

module.exports = mongoose.model('Workspace', workspaceSchema)
