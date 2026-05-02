require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose  = require('mongoose')
const bcrypt    = require('bcryptjs')
const User      = require('../models/User')
const Workspace = require('../models/Workspace')
const Lead      = require('../models/Lead')
const { v4: uuidv4 } = require('uuid')

const DEMO_LEADS = [
  { name:'Priya Sharma',  email:'priya@techstartup.io',   phone:'+91 98765 43210', source:'website',   status:'New',        score:85, dealValue:450000,  tags:['hot','saas'] },
  { name:'Arjun Mehta',   email:'arjun@designco.in',      phone:'+91 87654 32109', source:'referral',  status:'Qualified',  score:72, dealValue:280000,  tags:['agency'] },
  { name:'Kavita Nair',   email:'kavita@retailbrand.com', phone:'+91 76543 21098', source:'linkedin',  status:'Proposal',   score:91, dealValue:1200000, tags:['enterprise','hot'] },
  { name:'Rohit Verma',   email:'rohit@fintech.io',       phone:'+91 65432 10987', source:'google_ads',status:'Negotiation',score:68, dealValue:750000,  tags:['fintech'] },
  { name:'Anjali Singh',  email:'anjali@ecom.in',         phone:'+91 54321 09876', source:'instagram', status:'Won',        score:94, dealValue:320000,  tags:['ecommerce','vip'] },
  { name:'Vikram Bose',   email:'vikram@logistix.com',    phone:'+91 43210 98765', source:'cold_call', status:'Lost',       score:34, dealValue:180000,  tags:['logistics'] },
  { name:'Meera Iyer',    email:'meera@healthtech.io',    phone:'+91 32109 87654', source:'website',   status:'New',        score:77, dealValue:560000,  tags:['health','saas'] },
  { name:'Suresh Patel',  email:'suresh@manufact.in',     phone:'+91 21098 76543', source:'referral',  status:'Qualified',  score:61, dealValue:890000,  tags:['b2b'] },
  { name:'Pooja Gupta',   email:'pooja@edtech.com',       phone:'+91 10987 65432', source:'email',     status:'Cold',       score:28, dealValue:120000,  tags:['edtech'] },
  { name:'Kiran Reddy',   email:'kiran@realestate.io',    phone:'+91 99876 54321', source:'website',   status:'Proposal',   score:83, dealValue:2500000, tags:['realty','hot'] },
]

async function seedDemo() {
  try {
    const exists = await User.findOne({ email: 'demo@veloracrm.com' })
    if (exists) return
    const workspace = await Workspace.create({
      name: 'Velora Agency',
      ownerId: new mongoose.Types.ObjectId(),
      apiKey: `vl_live_${uuidv4().replace(/-/g,'').slice(0,24)}`,
    })
    const user = await User.create({
      name: 'Alex Rivera', email: 'demo@veloracrm.com',
      password: 'demo1234', role: 'admin', workspaceId: workspace._id,
    })
    workspace.ownerId = user._id
    workspace.members = [{ userId: user._id, role: 'admin' }]
    await workspace.save()
    await Lead.insertMany(DEMO_LEADS.map((l) => ({ ...l, workspaceId: workspace._id, assignedTo: user._id })))
    console.log('✅ Demo data seeded: demo@veloracrm.com / demo1234')
  } catch (err) {
    if (err.code !== 11000) console.error('Seed error:', err.message)
  }
}

module.exports = { seedDemo }

// Run standalone: node src/utils/seedData.js
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await seedDemo()
    mongoose.disconnect()
  })
}
