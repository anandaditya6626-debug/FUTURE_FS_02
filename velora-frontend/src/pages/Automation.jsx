import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Zap, Play, Pause, Trash2, ChevronRight, Mail, UserPlus, Clock, Bell, GitBranch } from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const MOCK_AUTOMATIONS = [
  { id:1, name:'New Lead Welcome', trigger:'New Lead Created', actions:['Send welcome email','Assign to sales rep'], active:true,  runs:128, lastRun:'2h ago' },
  { id:2, name:'Follow-up Reminder', trigger:'Follow-up Due',    actions:['Send Slack notification','Create task'],   active:true,  runs:84,  lastRun:'5h ago' },
  { id:3, name:'Deal Won Celebration', trigger:'Status → Won',   actions:['Send congrats email','Update CRM tag'],   active:false, runs:23,  lastRun:'2d ago' },
  { id:4, name:'Cold Lead Re-engage', trigger:'No activity 14d', actions:['Send re-engagement email'],               active:true,  runs:47,  lastRun:'1d ago' },
]

const TRIGGERS = ['New Lead Created','Status Changed','Follow-up Due','No activity 7 days','No activity 14 days','Deal Won','Deal Lost']
const ACTIONS  = ['Send email','Send WhatsApp','Assign to rep','Create task','Add tag','Send Slack notification','Update status','Wait 2 days']

const TRIGGER_ICONS = { 'New Lead Created': UserPlus, 'Status Changed': GitBranch, 'Follow-up Due': Clock, default: Bell }

export default function Automation() {
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS)
  const [showBuilder, setShowBuilder] = useState(false)
  const [draft, setDraft] = useState({ name:'', trigger: TRIGGERS[0], actions: ['Send email'], delay: '' })

  const toggle = (id) => {
    setAutomations((a) => a.map((x) => x.id === id ? { ...x, active: !x.active } : x))
    const auto = automations.find((x) => x.id === id)
    toast.success(`Automation ${auto.active ? 'paused' : 'activated'}`)
  }

  const remove = (id) => { setAutomations((a) => a.filter((x) => x.id !== id)); toast.success('Automation deleted') }

  const addAction = () => setDraft({ ...draft, actions: [...draft.actions, ACTIONS[0]] })
  const updateAction = (i, val) => { const a = [...draft.actions]; a[i] = val; setDraft({ ...draft, actions: a }) }
  const removeAction = (i) => setDraft({ ...draft, actions: draft.actions.filter((_, idx) => idx !== i) })

  const save = () => {
    if (!draft.name.trim()) { toast.error('Name required'); return }
    setAutomations((a) => [...a, { id: Date.now(), name: draft.name, trigger: draft.trigger, actions: draft.actions, active: true, runs: 0, lastRun: 'Never' }])
    setShowBuilder(false)
    setDraft({ name:'', trigger: TRIGGERS[0], actions: ['Send email'], delay: '' })
    toast.success('Automation created!')
  }

  return (
    <div className="pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Automation Engine</h2>
          <p className="text-xs text-dark-400 mt-0.5">Build trigger-based workflows to automate your sales process</p>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => setShowBuilder(true)} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" />New Automation
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Active',    val: automations.filter((a) => a.active).length, color:'text-emerald-400', bg:'bg-emerald-500/10' },
          { label:'Total Runs',val: automations.reduce((s,a) => s+a.runs, 0),  color:'text-velora-400',  bg:'bg-velora-500/10' },
          { label:'Paused',    val: automations.filter((a) => !a.active).length,color:'text-amber-400',   bg:'bg-amber-500/10' },
        ].map((s) => (
          <div key={s.label} className={cn('glass rounded-2xl p-4 border border-white/[0.06]', s.bg)}>
            <p className="text-xs text-dark-400">{s.label}</p>
            <p className={cn('text-2xl font-display font-bold mt-1', s.color)}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Automation List */}
      <div className="space-y-3">
        {automations.map((auto, i) => {
          const TrigIcon = TRIGGER_ICONS[auto.trigger] || TRIGGER_ICONS.default
          return (
            <motion.div key={auto.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              className="glass rounded-2xl p-5 border border-white/[0.06] hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', auto.active ? 'bg-velora-500/20' : 'bg-dark-700')}>
                    <Zap className={cn('w-5 h-5', auto.active ? 'text-velora-400' : 'text-dark-500')} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white text-sm">{auto.name}</h3>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium', auto.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-dark-700 text-dark-400')}>
                        {auto.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    {/* Visual flow */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <TrigIcon className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-300">{auto.trigger}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-dark-600" />
                      {auto.actions.map((act, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-velora-500/10 border border-velora-500/20 rounded-lg text-xs text-velora-300">
                          {act}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-dark-500 mt-2">{auto.runs} runs · Last run {auto.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(auto.id)} className={cn('p-2 rounded-xl transition-colors', auto.active ? 'hover:bg-amber-500/10 text-amber-400' : 'hover:bg-emerald-500/10 text-emerald-400')}>
                    {auto.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => remove(auto.id)} className="p-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Builder Modal */}
      <AnimatePresence>
        {showBuilder && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowBuilder(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
                className="glass rounded-2xl border border-white/10 w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-display font-bold text-white text-lg mb-5">Build Automation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-1.5">Automation Name</label>
                    <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. New Lead Welcome" className="velora-input text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-dark-300 mb-1.5">🔥 Trigger</label>
                    <select value={draft.trigger} onChange={(e) => setDraft({ ...draft, trigger: e.target.value })} className="velora-input text-sm">
                      {TRIGGERS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-dark-300">⚡ Actions</label>
                      <button onClick={addAction} className="text-xs text-velora-400 hover:text-velora-300 flex items-center gap-1">
                        <Plus className="w-3 h-3" />Add action
                      </button>
                    </div>
                    <div className="space-y-2">
                      {draft.actions.map((act, i) => (
                        <div key={i} className="flex gap-2">
                          <select value={act} onChange={(e) => updateAction(i, e.target.value)} className="velora-input text-sm flex-1">
                            {ACTIONS.map((a) => <option key={a}>{a}</option>)}
                          </select>
                          {draft.actions.length > 1 && (
                            <button onClick={() => removeAction(i)} className="p-2 rounded-xl hover:bg-red-500/10 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowBuilder(false)} className="btn-secondary flex-1 justify-center py-2.5">Cancel</button>
                  <button onClick={save} className="btn-primary flex-1 justify-center py-2.5"><Zap className="w-4 h-4" />Create</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
