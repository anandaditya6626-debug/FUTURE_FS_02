import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Crown, Shield, User, MoreHorizontal, Mail, Trash2 } from 'lucide-react'
import { getInitials, generateColor, ROLE_CONFIG } from '../lib/utils'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const MOCK_MEMBERS = [
  { id:'1', name:'Alex Rivera',  email:'alex@velora.io',   role:'admin',   leads:0,  joined:'Jan 2026', status:'active' },
  { id:'2', name:'Raj Kumar',    email:'raj@velora.io',    role:'manager', leads:42, joined:'Feb 2026', status:'active' },
  { id:'3', name:'Sneha Mehta',  email:'sneha@velora.io',  role:'sales',   leads:38, joined:'Mar 2026', status:'active' },
  { id:'4', name:'Dev Patel',    email:'dev@velora.io',    role:'sales',   leads:29, joined:'Mar 2026', status:'active' },
  { id:'5', name:'Anita Roy',    email:'anita@velora.io',  role:'sales',   leads:21, joined:'Apr 2026', status:'invited' },
]

const ROLE_ICONS = { admin: Crown, manager: Shield, sales: User }

export default function Team() {
  const [members, setMembers] = useState(MOCK_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [invite, setInvite] = useState({ email:'', role:'sales' })

  const sendInvite = (e) => {
    e.preventDefault()
    if (!invite.email) return
    setMembers((m) => [...m, { id: String(Date.now()), name: invite.email.split('@')[0], email: invite.email, role: invite.role, leads:0, joined:'Now', status:'invited' }])
    toast.success(`Invite sent to ${invite.email}`)
    setShowInvite(false)
    setInvite({ email:'', role:'sales' })
  }

  return (
    <div className="pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Team</h2>
          <p className="text-xs text-dark-400 mt-0.5">{members.length} members in your workspace</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary text-sm py-2">
          <UserPlus className="w-4 h-4" />Invite Member
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
          <div key={role} className={cn('glass rounded-2xl p-4 border', cfg.bg.split(' ')[1])}>
            <p className="text-xs text-dark-400 capitalize mb-1">{cfg.label}s</p>
            <p className={cn('text-2xl font-display font-bold', cfg.color)}>
              {members.filter((m) => m.role === role).length}
            </p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white text-sm">Members</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {members.map((m, i) => {
            const RoleIcon = ROLE_ICONS[m.role] || User
            const roleCfg = ROLE_CONFIG[m.role] || {}
            return (
              <motion.div key={m.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold flex-shrink-0', generateColor(m.name))}>
                  {getInitials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-dark-400">{m.email}</p>
                </div>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium', roleCfg.bg, roleCfg.color, roleCfg.bg?.split(' ')[1])}>
                  <RoleIcon className="w-3 h-3" />
                  {roleCfg.label}
                </div>
                <div className="text-center hidden sm:block">
                  <p className="text-xs font-semibold text-white">{m.leads}</p>
                  <p className="text-[10px] text-dark-500">leads</p>
                </div>
                <div className="hidden sm:block">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full', m.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400')}>
                    {m.status}
                  </span>
                </div>
                <p className="text-xs text-dark-500 hidden md:block">{m.joined}</p>
                {m.role !== 'admin' && (
                  <button onClick={() => { setMembers((x) => x.filter((mb) => mb.id !== m.id)); toast.success('Member removed') }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="glass rounded-2xl border border-white/10 w-full max-w-md p-6">
            <h3 className="font-display font-bold text-white text-lg mb-5">Invite Team Member</h3>
            <form onSubmit={sendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Email Address</label>
                <input type="email" required value={invite.email} onChange={(e) => setInvite({...invite,email:e.target.value})}
                  placeholder="colleague@company.com" className="velora-input text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Role</label>
                <select value={invite.role} onChange={(e) => setInvite({...invite,role:e.target.value})} className="velora-input text-sm">
                  <option value="sales">Sales Rep</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary flex-1 justify-center py-2.5">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center py-2.5"><Mail className="w-4 h-4" />Send Invite</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
