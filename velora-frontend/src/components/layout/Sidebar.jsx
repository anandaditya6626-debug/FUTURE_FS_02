import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, GitBranch, BarChart3, Zap,
  MessageSquare, Calendar, Settings, LogOut, ChevronLeft,
  Bot, UserCheck, Building2, Sparkles
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { getInitials, generateColor } from '../../lib/utils'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard',      end: true },
  { to: '/leads',         icon: Users,           label: 'Leads' },
  { to: '/pipeline',      icon: GitBranch,       label: 'Pipeline' },
  { to: '/analytics',     icon: BarChart3,       label: 'Analytics' },
  { to: '/ai-assistant',  icon: Bot,             label: 'AI Assistant',   badge: 'AI' },
  { to: '/automation',    icon: Zap,             label: 'Automation' },
  { to: '/communications',icon: MessageSquare,   label: 'Inbox' },
  { to: '/calendar',      icon: Calendar,        label: 'Calendar' },
  { to: '/clients',       icon: UserCheck,       label: 'Clients' },
  { to: '/team',          icon: Building2,       label: 'Team' },
  { to: '/settings',      icon: Settings,        label: 'Settings' },
]

export default function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = getInitials(user?.name || 'U')
  const avatarGradient = generateColor(user?.name || '')

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-dark-900/80 border-r border-white/[0.06] backdrop-blur-xl z-30 flex-shrink-0 overflow-hidden"
    >
      {/* Background orbs */}
      <div className="orb w-40 h-40 bg-velora-600/10 -top-10 -left-10" />
      <div className="orb w-32 h-32 bg-blue-600/08 bottom-20 -right-10" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-velora-gradient flex items-center justify-center flex-shrink-0 shadow-neon-purple"
             style={{ background: 'linear-gradient(135deg, #6640ff, #3b82f6)' }}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-display font-bold text-lg text-gradient-neon">Velora</span>
              <span className="text-xs text-dark-400 block -mt-0.5 font-medium">CRM Platform</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn('nav-item group relative', isActive && 'active')
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-velora-400' : 'text-dark-400 group-hover:text-white')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 text-sm"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {badge && !collapsed && (
                  <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-velora-600/30 text-velora-300 border border-velora-500/30">
                    {badge}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-dark-800 border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-glass z-50">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-2 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
          <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', avatarGradient)}>
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-dark-400 truncate">{user?.role || 'Admin'}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={handleLogout} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-dark-500">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center hover:bg-dark-700 hover:border-velora-500/50 transition-all duration-200 z-10"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronLeft className="w-3.5 h-3.5 text-dark-400" />
        </motion.div>
      </button>
    </motion.aside>
  )
}
