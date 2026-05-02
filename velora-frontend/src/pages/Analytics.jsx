import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, DollarSign, Users, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Cell
} from 'recharts'
import { formatCurrency } from '../lib/utils'
import { cn } from '../lib/utils'

const REVENUE_DATA = [
  { month:'Jan', actual:420000, forecast:400000 }, { month:'Feb', actual:580000, forecast:520000 },
  { month:'Mar', actual:510000, forecast:550000 }, { month:'Apr', actual:760000, forecast:700000 },
  { month:'May', actual:920000, forecast:850000 }, { month:'Jun', actual:840000, forecast:900000 },
  { month:'Jul', forecast:1100000 }, { month:'Aug', forecast:1250000 }, { month:'Sep', forecast:1400000 },
]

const SOURCE_ROI = [
  { source:'Website',    spend:50000,  leads:45, revenue:890000 },
  { source:'Referral',   spend:20000,  leads:36, revenue:720000 },
  { source:'LinkedIn',   spend:80000,  leads:23, revenue:580000 },
  { source:'Google Ads', spend:120000, leads:15, revenue:320000 },
]

const TEAM_DATA = [
  { name:'Raj Kumar',  closed:12, value:2840000, rate:68, avatar:'RK', trend:+15 },
  { name:'Sneha M.',   closed:9,  value:1920000, rate:62, avatar:'SM', trend:+8  },
  { name:'Dev Patel',  closed:7,  value:1540000, rate:54, avatar:'DP', trend:-3  },
  { name:'Anita Roy',  closed:5,  value:980000,  rate:50, avatar:'AR', trend:+22 },
]

const FUNNEL_DATA = [
  { stage:'New',         value:1284, color:'#3b82f6' },
  { stage:'Qualified',   value:842,  color:'#8b5cf6' },
  { stage:'Proposal',    value:510,  color:'#f59e0b' },
  { stage:'Negotiation', value:280,  color:'#f97316' },
  { stage:'Won',         value:347,  color:'#10b981' },
]

const CustomTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-dark-400 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color:p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 10000 ? formatCurrency(p.value) : p.value}</p>)}
    </div>
  )
}

export default function Analytics() {
  return (
    <div className="pb-8 space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-white">Analytics & BI</h2>
        <p className="text-xs text-dark-400 mt-0.5">Business intelligence dashboard</p>
      </div>

      {/* Revenue Forecast */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Revenue & Forecast</h3>
            <p className="text-xs text-dark-400">Actual vs AI-predicted forecast</p>
          </div>
          <div className="flex gap-3 text-xs text-dark-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-velora-400 inline-block"/>Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block border border-dashed border-blue-400"/>Forecast</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6640ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6640ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="foreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill:'#64648a', fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:'#64648a', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)}/>
            <Tooltip content={<CustomTip />}/>
            <Area type="monotone" dataKey="actual"   stroke="#6640ff" strokeWidth={2} fill="url(#actGrad)"  name="Actual"/>
            <Area type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} fill="url(#foreGrad)" strokeDasharray="5 5" name="Forecast"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Conversion Funnel */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {FUNNEL_DATA.map((s, i) => {
              const pct = Math.round((s.value / FUNNEL_DATA[0].value) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-dark-300">{s.stage}</span>
                    <span className="text-white font-medium">{s.value.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, delay:i*0.1 }}
                      className="h-full rounded-full" style={{ background: s.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Lead Source ROI */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold text-white mb-4">Source ROI</h3>
          <div className="space-y-3">
            {SOURCE_ROI.map((s, i) => {
              const roi = Math.round((s.revenue - s.spend) / s.spend * 100)
              return (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-dark-800/40 rounded-xl">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">{s.source}</span>
                      <span className={cn('font-bold', roi > 0 ? 'text-emerald-400' : 'text-red-400')}>{roi > 0 ? '+' : ''}{roi}% ROI</span>
                    </div>
                    <p className="text-[10px] text-dark-500 mt-0.5">{s.leads} leads · Spend: {formatCurrency(s.spend)} · Revenue: {formatCurrency(s.revenue)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Team Leaderboard */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Team Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {TEAM_DATA.map((member, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-dark-800/40 rounded-xl">
              <span className={cn('w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0', i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-500/20 text-slate-400' : 'bg-dark-700 text-dark-400')}>
                #{i+1}
              </span>
              <div className="w-8 h-8 rounded-xl bg-velora-600/30 flex items-center justify-center text-xs font-bold text-velora-300 flex-shrink-0">{member.avatar}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-dark-400">{member.closed} deals · {member.rate}% conversion</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">{formatCurrency(member.value)}</p>
                <p className={cn('text-xs flex items-center justify-end gap-0.5', member.trend > 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {member.trend > 0 ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}{Math.abs(member.trend)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
