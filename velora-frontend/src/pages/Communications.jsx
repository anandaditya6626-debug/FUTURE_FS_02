import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MessageSquare, Search, Filter, Plus } from 'lucide-react'
import { formatRelativeTime, getInitials, generateColor } from '../lib/utils'
import { cn } from '../lib/utils'

const TABS = [
  { id:'all',       label:'All',       icon: MessageSquare },
  { id:'email',     label:'Email',     icon: Mail },
  { id:'call',      label:'Calls',     icon: Phone },
  { id:'whatsapp',  label:'WhatsApp',  icon: MessageSquare },
]

const MOCK_LOGS = [
  { id:1, type:'email',    lead:'Kavita Nair',    subject:'Proposal Follow-up',          body:'Hi Kavita, following up on the proposal I shared...',   time: Date.now()-3600000,   direction:'out' },
  { id:2, type:'call',     lead:'Rohit Verma',    subject:'Discovery Call — 28 min',     body:'Discussed budget, timeline, and key requirements.',      time: Date.now()-7200000,   direction:'in' },
  { id:3, type:'whatsapp', lead:'Priya Sharma',   subject:'Quick intro message',         body:'Hey Priya! Thanks for checking out our platform...',     time: Date.now()-86400000,  direction:'out' },
  { id:4, type:'email',    lead:'Arjun Mehta',    subject:'Agency pricing plan',         body:'Hi Arjun, attaching our agency-specific pricing...',     time: Date.now()-172800000, direction:'out' },
  { id:5, type:'call',     lead:'Meera Iyer',     subject:'Intro call — 15 min',         body:'Brief call covering product overview and pain points.',   time: Date.now()-259200000, direction:'out' },
  { id:6, type:'whatsapp', lead:'Suresh Patel',   subject:'Demo confirmation',           body:'Confirming our demo tomorrow at 11 AM. See you then!',   time: Date.now()-345600000, direction:'in' },
]

const TYPE_CONFIG = {
  email:    { icon: Mail,           color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  call:     { icon: Phone,          color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  whatsapp: { icon: MessageSquare,  color: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20' },
}

const TEMPLATES = [
  { name:'Follow-up Email',    type:'email',    body:'Hi {{name}}, just following up on our last conversation. Would love to connect this week...' },
  { name:'Intro WhatsApp',     type:'whatsapp', body:'Hey {{name}}! 👋 Came across your profile and thought VeloraCRM could be a great fit...' },
  { name:'Demo Invite',        type:'email',    body:'Hi {{name}}, I\'d love to show you VeloraCRM live. Would {{date}} work for a 30-min demo?' },
]

export default function Communications() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = MOCK_LOGS.filter((l) =>
    (activeTab === 'all' || l.type === activeTab) &&
    (l.lead.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="pb-8 space-y-5 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Communication Hub</h2>
          <p className="text-xs text-dark-400 mt-0.5">Unified inbox for all channels</p>
        </div>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4" />Log Activity</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 h-full">
        {/* Inbox List */}
        <div className="xl:col-span-1 space-y-3">
          {/* Tabs */}
          <div className="flex gap-1 glass rounded-xl p-1">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeTab === t.id ? 'bg-velora-600/30 text-white' : 'text-dark-400 hover:text-white')}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
              className="velora-input pl-8 py-2 text-xs" />
          </div>
          {/* Log items */}
          <div className="space-y-2 overflow-y-auto scrollbar-hide max-h-[500px]">
            {filtered.map((log, i) => {
              const cfg = TYPE_CONFIG[log.type]
              return (
                <motion.div key={log.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
                  onClick={() => setSelected(log)}
                  className={cn('glass-hover rounded-xl p-3.5 cursor-pointer transition-all', selected?.id === log.id && 'border-velora-500/40')}>
                  <div className="flex items-start gap-3">
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg, cfg.border, 'border')}>
                      <cfg.icon className={cn('w-3.5 h-3.5', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-white truncate">{log.lead}</p>
                        <span className="text-[10px] text-dark-500 flex-shrink-0 ml-2">{formatRelativeTime(log.time)}</span>
                      </div>
                      <p className="text-[11px] text-dark-300 truncate">{log.subject}</p>
                      <p className="text-[10px] text-dark-500 truncate mt-0.5">{log.body}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Detail pane */}
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          {selected ? (
            <div className="h-full flex flex-col">
              <div className="flex items-start gap-3 pb-4 border-b border-white/[0.06] mb-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', TYPE_CONFIG[selected.type].bg)}>
                  {(() => { const I = TYPE_CONFIG[selected.type].icon; return <I className={cn('w-5 h-5', TYPE_CONFIG[selected.type].color)} /> })()}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{selected.subject}</h3>
                  <p className="text-xs text-dark-400">{selected.lead} · {formatRelativeTime(selected.time)} · {selected.direction === 'out' ? 'Outbound' : 'Inbound'}</p>
                </div>
              </div>
              <p className="text-sm text-dark-200 leading-relaxed">{selected.body}</p>
              <div className="mt-auto pt-4 border-t border-white/[0.06]">
                <textarea placeholder="Write a reply..." rows={3} className="velora-input text-sm w-full resize-none mb-3" />
                <button className="btn-primary text-sm py-2"><Mail className="w-4 h-4" />Send Reply</button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MessageSquare className="w-14 h-14 mx-auto mb-3 text-dark-700" />
                <p className="text-dark-400 text-sm">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="font-semibold text-white text-sm mb-3">Message Templates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((t, i) => (
            <div key={i} className="glass-hover rounded-xl p-4 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full', TYPE_CONFIG[t.type].bg, TYPE_CONFIG[t.type].color)}>{t.type}</span>
                <p className="text-xs font-semibold text-white">{t.name}</p>
              </div>
              <p className="text-[11px] text-dark-400 line-clamp-2">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
