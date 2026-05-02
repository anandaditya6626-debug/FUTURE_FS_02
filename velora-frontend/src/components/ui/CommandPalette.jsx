import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, LayoutDashboard, Users, GitBranch, BarChart3,
  Bot, Zap, MessageSquare, Calendar, Settings, UserCheck,
  Building2, Plus, ArrowRight, Command
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

const COMMANDS = [
  { id: 'dash',   label: 'Go to Dashboard',      icon: LayoutDashboard, path: '/',               group: 'Navigate' },
  { id: 'leads',  label: 'Go to Leads',           icon: Users,           path: '/leads',          group: 'Navigate' },
  { id: 'pipe',   label: 'Go to Pipeline',        icon: GitBranch,       path: '/pipeline',       group: 'Navigate' },
  { id: 'anal',   label: 'Go to Analytics',       icon: BarChart3,       path: '/analytics',      group: 'Navigate' },
  { id: 'ai',     label: 'Open AI Assistant',     icon: Bot,             path: '/ai-assistant',   group: 'Navigate' },
  { id: 'auto',   label: 'Go to Automation',      icon: Zap,             path: '/automation',     group: 'Navigate' },
  { id: 'comm',   label: 'Go to Inbox',           icon: MessageSquare,   path: '/communications', group: 'Navigate' },
  { id: 'cal',    label: 'Go to Calendar',        icon: Calendar,        path: '/calendar',       group: 'Navigate' },
  { id: 'clients',label: 'Go to Clients',         icon: UserCheck,       path: '/clients',        group: 'Navigate' },
  { id: 'team',   label: 'Go to Team',            icon: Building2,       path: '/team',           group: 'Navigate' },
  { id: 'set',    label: 'Go to Settings',        icon: Settings,        path: '/settings',       group: 'Navigate' },
  { id: 'new-lead',label: 'Add New Lead',         icon: Plus,            path: '/leads',          group: 'Actions',  action: 'add-lead' },
]

export default function CommandPalette({ open }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef  = useRef(null)
  const navigate  = useNavigate()
  const { setCommandPalette } = useUIStore()

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setCommandPalette(false)
      if (e.key === 'ArrowDown') setSelected((s) => Math.min(s + 1, filtered.length - 1))
      if (e.key === 'ArrowUp')   setSelected((s) => Math.max(s - 1, 0))
      if (e.key === 'Enter' && filtered[selected]) runCommand(filtered[selected])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, selected, filtered])

  const runCommand = (cmd) => {
    setCommandPalette(false)
    navigate(cmd.path)
  }

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = []
    acc[cmd.group].push(cmd)
    return acc
  }, {})

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setCommandPalette(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-glass">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                <Search className="w-5 h-5 text-dark-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
                  placeholder="Search commands, pages, leads..."
                  className="flex-1 bg-transparent text-white placeholder-dark-500 text-sm outline-none"
                />
                <div className="flex items-center gap-1.5">
                  <kbd className="text-[10px] px-1.5 py-0.5 bg-dark-800 border border-white/10 rounded text-dark-400">ESC</kbd>
                  <button onClick={() => setCommandPalette(false)} className="text-dark-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="py-2 max-h-80 overflow-y-auto scrollbar-hide">
                {filtered.length === 0 ? (
                  <div className="text-center py-10 text-dark-500 text-sm">
                    <Command className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No commands found
                  </div>
                ) : (
                  Object.entries(grouped).map(([group, cmds]) => (
                    <div key={group}>
                      <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-dark-500 font-semibold">{group}</p>
                      {cmds.map((cmd, i) => {
                        const globalIdx = filtered.indexOf(cmd)
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => runCommand(cmd)}
                            onMouseEnter={() => setSelected(globalIdx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              globalIdx === selected ? 'bg-velora-600/20 text-white' : 'text-dark-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <cmd.icon className="w-4 h-4 flex-shrink-0 text-velora-400" />
                            <span className="flex-1 text-left">{cmd.label}</span>
                            {globalIdx === selected && (
                              <ArrowRight className="w-3.5 h-3.5 text-velora-400" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-dark-500">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-dark-800 border border-white/10 rounded">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-dark-800 border border-white/10 rounded">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-dark-800 border border-white/10 rounded">ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
