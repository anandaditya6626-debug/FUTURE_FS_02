const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

const store = {
  users: [
    { _id: 'u1', name: 'Alex Rivera', email: 'demo@veloracrm.com', password: 'hashed_demo1234', role: 'admin', workspaceId: 'w1' }
  ],
  workspaces: [
    { _id: 'w1', name: 'Velora Agency', ownerId: 'u1', apiKey: 'vl_live_demo_key_12345', members: [{ userId: 'u1', role: 'admin' }] }
  ],
  leads: [
    { _id: 'l1', name: 'Priya Sharma', email: 'priya@techstartup.io', phone: '+91 98765 43210', source: 'website', status: 'New', score: 85, dealValue: 450000, tags: ['hot', 'saas'], workspaceId: 'w1', assignedTo: 'u1', createdAt: new Date() },
    { _id: 'l2', name: 'Arjun Mehta', email: 'arjun@designco.in', phone: '+91 87654 32109', source: 'referral', status: 'Qualified', score: 72, dealValue: 280000, tags: ['agency'], workspaceId: 'w1', assignedTo: 'u1', createdAt: new Date() },
    { _id: 'l3', name: 'Kavita Nair', email: 'kavita@retailbrand.com', phone: '+91 76543 21098', source: 'linkedin', status: 'Proposal', score: 91, dealValue: 1200000, tags: ['enterprise', 'hot'], workspaceId: 'w1', assignedTo: 'u1', createdAt: new Date() },
  ],
  tasks: [],
  automations: [],
}

module.exports = {
  get: (type) => store[type],
  findOne: (type, query) => store[type].find(item => Object.keys(query).every(key => item[key] === query[key])),
  findById: (type, id) => store[type].find(item => item._id === String(id)),
  create: (type, data) => {
    const newItem = { _id: uuidv4(), ...data, createdAt: new Date(), updatedAt: new Date() }
    store[type].push(newItem)
    return newItem
  },
  update: (type, id, data) => {
    const idx = store[type].findIndex(item => item._id === String(id))
    if (idx === -1) return null
    store[type][idx] = { ...store[type][idx], ...data, updatedAt: new Date() }
    return store[type][idx]
  },
  delete: (type, id) => {
    const idx = store[type].findIndex(item => item._id === String(id))
    if (idx !== -1) store[type].splice(idx, 1)
  }
}
