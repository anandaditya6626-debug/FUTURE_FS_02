import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle } from 'lucide-react'
import { cn, formatDate } from '../lib/utils'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const MOCK_EVENTS = [
  { id:1, title:'Demo — Kavita Nair',    date:'2026-05-05', time:'10:00', type:'demo',     color:'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id:2, title:'Follow-up — Rohit',     date:'2026-05-06', time:'14:00', type:'followup', color:'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id:3, title:'Proposal Review',       date:'2026-05-08', time:'11:30', type:'meeting',  color:'bg-velora-500/20 text-velora-300 border-velora-500/30' },
  { id:4, title:'Team Standup',          date:'2026-05-09', time:'09:00', type:'meeting',  color:'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id:5, title:'Cold Lead Outreach',    date:'2026-05-12', time:'16:00', type:'task',     color:'bg-pink-500/20 text-pink-300 border-pink-500/30' },
]

const TASKS = [
  { id:1, title:'Send proposal to Kiran Reddy', due:'Today',    priority:'high',   done:false },
  { id:2, title:'Update pipeline stages',        due:'Tomorrow', priority:'medium', done:false },
  { id:3, title:'Review Q2 analytics report',    due:'May 8',    priority:'low',    done:true  },
  { id:4, title:'Onboard new sales rep',         due:'May 10',   priority:'high',   done:false },
]

const PRIORITY_CFG = {
  high:   'bg-red-500/15 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  low:    'bg-dark-700 text-dark-400 border-white/10',
}

export default function CalendarPage() {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [tasks, setTasks] = useState(TASKS)

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  const prevMonth = () => setCurrent((c) => c.month === 0 ? { year:c.year-1, month:11 } : { ...c, month:c.month-1 })
  const nextMonth = () => setCurrent((c) => c.month === 11 ? { year:c.year+1, month:0 } : { ...c, month:c.month+1 })

  const getEventsForDay = (day) => {
    const dateStr = `${current.year}-${String(current.month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return MOCK_EVENTS.filter((e) => e.date === dateStr)
  }

  const toggleTask = (id) => setTasks((t) => t.map((x) => x.id === id ? { ...x, done: !x.done } : x))

  return (
    <div className="pb-8 grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Calendar */}
      <div className="xl:col-span-2 glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white text-lg">{MONTHS[current.month]} {current.year}</h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10 text-dark-400 hover:text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setCurrent({ year:today.getFullYear(), month:today.getMonth() })} className="px-3 py-1.5 rounded-xl text-xs btn-secondary">Today</button>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 text-dark-400 hover:text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => <div key={d} className="text-center text-[10px] font-semibold text-dark-500 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
            const events  = getEventsForDay(day)
            return (
              <motion.div key={i} whileHover={{ scale:1.02 }}
                className={cn('min-h-[72px] rounded-xl p-1.5 cursor-pointer border transition-all',
                  isToday ? 'border-velora-500/50 bg-velora-500/10' : 'border-transparent hover:border-white/10 hover:bg-white/[0.02]')}>
                <span className={cn('text-xs font-semibold block mb-1', isToday ? 'text-velora-400' : 'text-dark-300')}>{day}</span>
                {events.map((ev) => (
                  <div key={ev.id} className={cn('text-[9px] px-1.5 py-0.5 rounded-md mb-0.5 border truncate', ev.color)}>
                    {ev.time} {ev.title}
                  </div>
                ))}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Sidebar — Upcoming + Tasks */}
      <div className="space-y-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-3 text-sm">Upcoming Events</h3>
          <div className="space-y-2">
            {MOCK_EVENTS.slice(0,4).map((ev) => (
              <div key={ev.id} className={cn('flex items-start gap-3 p-2.5 rounded-xl border', ev.color)}>
                <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">{ev.title}</p>
                  <p className="text-[10px] opacity-70">{ev.date} · {ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white text-sm">Tasks</h3>
            <button className="btn-ghost text-xs py-1"><Plus className="w-3 h-3" />Add</button>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="w-3.5 h-3.5 accent-velora-500 cursor-pointer mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs', task.done ? 'line-through text-dark-500' : 'text-dark-200')}>{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-dark-500">{task.due}</span>
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded border capitalize', PRIORITY_CFG[task.priority])}>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
