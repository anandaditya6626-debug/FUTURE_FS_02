const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:         { type: String, required: true, minlength: 8, select: false },
  role:             { type: String, enum: ['admin','manager','sales'], default: 'admin' },
  workspaceId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  avatar:           { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret:  { type: String, select: false },
  lastLogin:        { type: Date },
  isActive:         { type: Boolean, default: true },
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.matchPassword = async function(entered) {
  return bcrypt.compare(entered, this.password)
}

userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  delete obj.twoFactorSecret
  return obj
}

module.exports = mongoose.model('User', userSchema)
