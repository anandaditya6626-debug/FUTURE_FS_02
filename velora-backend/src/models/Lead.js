const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName:{ type: String },
}, { timestamps: true })

const followUpSchema = new mongoose.Schema({
  text:    { type: String, required: true },
  dueDate: { type: Date },
  done:    { type: Boolean, default: false },
}, { timestamps: true })

const activitySchema = new mongoose.Schema({
  type:        { type: String, enum: ['email','call','whatsapp','note','update','meeting'], default: 'update' },
  description: { type: String },
  by:          { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  byName:      { type: String },
}, { timestamps: true })

const leadSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, trim: true, lowercase: true },
  phone:         { type: String, trim: true },
  company:       { type: String, trim: true },
  website:       { type: String },
  source:        { type: String, enum: ['website','referral','linkedin','instagram','facebook','google_ads','email','cold_call','other'], default: 'other' },
  status:        { type: String, enum: ['New','Qualified','Proposal','Negotiation','Won','Lost','Cold'], default: 'New' },
  score:         { type: Number, min: 0, max: 100, default: 50 },
  tags:          [{ type: String }],
  notes:         [noteSchema],
  attachments:   [{ name: String, url: String, type: String }],
  followUps:     [followUpSchema],
  timeline:      [activitySchema],
  assignedTo:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dealValue:     { type: Number, default: 0 },
  pipelineStage: { type: String },
  workspaceId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  customFields:  { type: Map, of: mongoose.Schema.Types.Mixed },
  geoLocation:   { city: String, country: String, lat: Number, lng: Number },
  convertedAt:   { type: Date },
  isClient:      { type: Boolean, default: false },
}, { timestamps: true })

leadSchema.index({ workspaceId: 1, status: 1 })
leadSchema.index({ workspaceId: 1, createdAt: -1 })
leadSchema.index({ email: 1, workspaceId: 1 })

module.exports = mongoose.model('Lead', leadSchema)
