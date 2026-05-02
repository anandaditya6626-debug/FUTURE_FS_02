import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Mail, Globe, MapPin, Star, MessageSquare, Calendar, FileText, Plus, Send, Edit2, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate, STATUS_CONFIG, SOURCE_LABELS, getInitials, generateColor, getScoreColor } from '../lib/utils'
import { cn } from '../lib/utils'

const MOCK_LEAD = {
  _id: '3', name: 'Kavita Nair', email: 'kavita@retailbrand.com', phone: '+91 76543 21098',
  company: 'RetailBrand Solutions', website: 'retailbrand.com', location: 'Mumbai, Maharashtra',
  source: 'linkedin', status: 'Proposal', score: 91, dealValue: 1200000,
  tags: ['enterprise', 'hot', 'priority'],
  assignedTo: { name: 'Raj Kumar', email: 'raj@velora.io' },
  createdAt: new Date(Date.now() - 86400000 * 8),
  notes: [
    { id: 1, text: 'Very interested in automation features. Budget confirmed at ₹12L.', author: 'Raj K', createdAt: new Date(Date.now() - 86400000 * 3) },
    { id: 2, text: 'Sent proposal deck. Follow up in 2 days.', author: 'Raj K', createdAt: new Date(Date.now() - 86400000 * 1) },
  ],
  timeline: [
    { type: 'email',  icon: '📧', text: 'Initial outreach email sent', time: new Date(Date.now() - 86400000 * 8) },
    { type: 'call',   icon: '📞', text: 'Discovery call — 32 minutes', time: new Date(Date.now() - 86400000 * 6) },
    { type: 'update', icon: '✏️', text: 'Status updated: New → Qualified', time: new Date(Date.now() - 86400000 * 5) },
    { type: 'email',  icon: '📧', text: 'Proposal deck sent via email', time: new Date(Date.now() - 86400000 * 1) },
  ],
  followUps: [
    { id: 1, text: 'Follow up on proposal', dueDate: new Date(Date.now() + 86400000 * 1), done: false },
    { id: 2, text: 'Schedule demo call',    dueDate: new Date(Date.now() + 86400000 * 3), done: false },
  ],
}

export default function LeadProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState('')
  const [activeTab, setActiveTab] = useState('timeline')
  const lead = MOCK_LEAD
  const cfg  = STATUS_CONFIG[lead.status] || {}
  const grad = generateColor(lead.name)
  const scoreGrad = getScoreColor(lead.score)

  const relationshipStr = Math.min(100, Math.round((lead.score * 0.6) + (lead.timeline.length * 10)))

  return (
    <div className="pb-8 max-w-6xl">
      {/* Back */}
      <button onClick={() => navigate('/leads')} className="btn-ghost mb-5 text-sm">
        <ArrowLeft className="w-4 h-4" />Back to Leads
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left — Profile Card */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-col items-center text-center mb-5">
              <div className={cn('w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-2xl font-bold mb-3', grad)}>
                {getInitials(lead.name)}
              </div>
              <h2 className="font-display font-bold text-xl text-white">{lead.name}</h2>
              <p className="text-sm text-dark-400">{lead.company}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn('text-xs px-2.5 py-1 rounded-full', cfg.className)}>{lead.status}</span>
                {lead.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-dark-300">#{t}</span>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { icon: Mail,    val: lead.email },
                { icon: Phone,   val: lead.phone },
                { icon: Globe,   val: lead.website },
                { icon: MapPin,  val: lead.location },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-2.5 text-dark-300">
                  <Icon className="w-4 h-4 text-dark-500 flex-shrink-0" />
                  <span className="truncate text-xs">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Score + Deal */}
          <div className="glass rounded-2xl p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-dark-400">Lead Score</span>
                <span className="font-bold text-white">{lead.score}/100</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${lead.score}%` }} transition={{ duration:1, ease:'easeOut' }}
                  className={cn('h-full rounded-full bg-gradient-to-r', scoreGrad)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-dark-400">Relationship Strength</span>
                <span className="font-bold text-white">{relationshipStr}%</span>
              </div>
              <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:`${relationshipStr}%` }} transition={{ duration:1.2, ease:'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 to-velora-500" />
              </div>
            </div>
            <div className="pt-2 border-t border-white/[0.06]">
              <p className="text-xs text-dark-400 mb-1">Deal Value</p>
              <p className="text-2xl font-display font-bold text-gradient-neon">{formatCurrency(lead.dealValue)}</p>
            </div>
          </div>

          {/* Assigned */}
          <div className="glass rounded-2xl p-4">
            <p className="text-xs text-dark-400 mb-2">Assigned To</p>
            <div className="flex items-center gap-2.5">
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center', generateColor(lead.assignedTo.name))}>
                {getInitials(lead.assignedTo.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{lead.assignedTo.name}</p>
                <p className="text-xs text-dark-400">{lead.assignedTo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tab Nav */}
          <div className="glass rounded-2xl p-1 flex gap-1">
            {['timeline','notes','followups'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all duration-200',
                  activeTab === tab ? 'bg-velora-600/30 text-white border border-velora-500/30' : 'text-dark-400 hover:text-white')}>
                {tab}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {activeTab === 'timeline' && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Activity Timeline</h3>
              <div className="space-y-0">
                {lead.timeline.map((item, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                    className="flex gap-4 pb-5 relative">
                    {i < lead.timeline.length - 1 && <div className="absolute left-4 top-8 w-px h-full bg-white/[0.06]" />}
                    <div className="w-8 h-8 rounded-xl bg-dark-700 flex items-center justify-center text-sm flex-shrink-0 z-10">{item.icon}</div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm text-white">{item.text}</p>
                      <p className="text-xs text-dark-500 mt-0.5">{formatDate(item.time)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {activeTab === 'notes' && (
            <div className="glass rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-white">Notes</h3>
              <div className="space-y-3">
                {lead.notes.map((n) => (
                  <div key={n.id} className="bg-dark-800/60 rounded-xl p-3.5 border border-white/[0.06]">
                    <p className="text-sm text-dark-200">{n.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-dark-500">{n.author}</span>
                      <span className="text-dark-700">·</span>
                      <span className="text-xs text-dark-500">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..."
                  className="velora-input text-sm flex-1" />
                <button onClick={() => setNote('')} className="btn-primary py-2 px-3">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Follow-ups */}
          {activeTab === 'followups' && (
            <div className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Follow-ups</h3>
                <button className="btn-secondary text-xs py-1.5"><Plus className="w-3.5 h-3.5" />Add</button>
              </div>
              {lead.followUps.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-dark-800/60 rounded-xl border border-white/[0.06]">
                  <input type="checkbox" defaultChecked={f.done} className="w-4 h-4 accent-velora-500 cursor-pointer" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{f.text}</p>
                    <p className="text-xs text-dark-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(f.dueDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
