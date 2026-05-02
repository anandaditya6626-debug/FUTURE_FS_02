import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Bell, Plus, Command, X, ChevronDown,
  LogOut, Settings, User, Moon, Zap
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { getInitials, generateColor, formatRelativeTime } from '../../lib/utils'
import { cn } from '../../lib/utils'

const BREADCRUMB_MAP = {
  '/':              'Dashboard',
  '/leads':         'Leads',
  '/pipeline':      'Pipeline',
  '/analytics':     'Analytics',
  '/ai-assistant':  'AI Assistant',
  '/automation':    'Automation',
  '/communications':'Inbox',
  '/calendar':      'Calendar',
  '/clients':       'Clients',
  '/team':          'Team',
  '/settings':      'Settings',
}

export default function Navbar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuthStore()
  const { setCommandPalette, notifications, unreadCount, markAllRead } = useUIStore()
  const [profileOpen, setProfileOpen]   = useState(false)
  const [notifOpen, setNotifOpen]       = useState(false)
  const profileRef = useRef(null)
  const notifRef   = useRef(null)

  const pageTitle = BREADCRUMB_MAP[location.pathname] || 'VeloraCRM'
  const initials  = getInitials(user?.name || 'U')
  const gradient  = generateColor(user?.name || '')

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPalette(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setCommandPalette])

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-dark-900/60 backdrop-blur-xl flex-shrink-0">
      {/* Left: Page title */}
      <div>
        <h1 className="font-display font-semibold text-white text-lg">{pageTitle}</h1>
        <p className="text-xs text-dark-400">VeloraCRM · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* Center: Search bar */}
      <button
        onClick={() => setCommandPalette(true)}
        className="hidden md:flex items-center gap-3 px-4 py-2 glass rounded-xl text-dark-400 hover:text-white hover:border-white/20 transition-all duration-200 w-72"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm flex-1 text-left">Search anything...</span>
        <kbd className="flex items-center gap-1 text-[10px] bg-dark-800 px-1.5 py-0.5 rounded-md border border-white/10">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Add Lead CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/leads')}
          className="btn-primary text-sm px-3 py-2 hidden sm:flex"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </motion.button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead() }}
            className="relative w-9 h-9 glass rounded-xl flex items-center justify-center hover:border-white/20 transition-all"
          >
            <Bell className="w-4 h-4 text-dark-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-velora-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 glass rounded-2xl p-2 z-50 border border-white/10 shadow-glass"
              >
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <span className="font-semibold text-sm text-white">Notifications</span>
                  <button onClick={() => setNotifOpen(false)} className="text-dark-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-dark-500 text-sm">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No notifications yet
                  </div>
                ) : (
                  <div className="space-y-1 max-h-72 overflow-y-auto scrollbar-hide">
                    {notifications.map((n) => (
                      <div key={n.id} className={cn('flex gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors', !n.read && 'bg-velora-500/5')}>
                        <div className="w-8 h-8 rounded-lg bg-velora-600/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-velora-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-medium truncate">{n.title}</p>
                          <p className="text-[11px] text-dark-400">{n.message}</p>
                          <p className="text-[10px] text-dark-500 mt-0.5">{formatRelativeTime(n.id)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 glass rounded-xl hover:border-white/20 transition-all"
          >
            <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold', gradient)}>
              {initials}
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-dark-400 transition-transform duration-200', profileOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-52 glass rounded-2xl overflow-hidden z-50 border border-white/10 shadow-glass"
              >
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {[
                    { icon: User,     label: 'Profile',  action: () => { navigate('/settings'); setProfileOpen(false) } },
                    { icon: Settings, label: 'Settings', action: () => { navigate('/settings'); setProfileOpen(false) } },
                  ].map(({ icon: Icon, label, action }) => (
                    <button key={label} onClick={action}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-dark-300 hover:text-white transition-colors text-sm">
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-white/[0.06] pt-1 mt-1">
                    <button
                      onClick={() => { logout(); navigate('/login') }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
