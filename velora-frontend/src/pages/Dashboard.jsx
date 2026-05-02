import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, TrendingUp, DollarSign, Percent, ArrowUpRight, ArrowDownRight,
  Zap, Star, AlertTriangle, Activity, Eye, RefreshCw
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '../services/api'
import { formatCurrency, formatRelativeTime } from '../lib/utils'
import { SkeletonKPI, SkeletonCard } from '../components/ui/Skeleton'

// ── Mock data (shown when backend offline) ────────────────────────────────────
const MOCK = {
  kpis: [
    { label: 'Total Leads',     value: 1284,   change: +12.5, icon: Users,        gradient: 'from-blue-500/20 to-blue-600/10',    iconColor: 'text-blue-400',    border: 'border-blue-500/20' },
    { label: 'Conversions',     value: 347,    change: +8.2,  icon: TrendingUp,   gradient: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', border: 'border-emerald-500/20' },
    { label: 'Revenue',         value: 2840000,change: +22.1, icon: DollarSign,   gradient: 'from-velora-500/20 to-velora-600/10', iconColor: 'text-velora-400', border: 'border-velora-500/20', isCurrency: true },
    { label: 'Conversion Rate', value: 27.0,   change: -2.3,  icon: Percent,      gradient: 'from-pink-500/20 to-pink-600/10',    iconColor: 'text-pink-400',    border: 'border-pink-500/20',   isPercent: true },
  ],
  revenue: [
    { month: 'Jan', revenue: 420000, leads: 95 },
    { month: 'Feb', revenue: 580000, leads: 120 },
    { month: 'Mar', revenue: 510000, leads: 110 },
    { month: 'Apr', revenue: 760000, leads: 155 },
    { month: 'May', revenue: 920000, leads: 180 },
    { month: 'Jun', revenue: 840000, leads: 165 },
    { month: 'Jul', revenue: 1100000, leads: 210 },
  ],
  funnel: [
    { name: 'New Leads',    value: 1284, fill: '#3b82f6' },
    { name: 'Qualified',   value: 842,  fill: '#8b5cf6' },
    { name: 'Proposal',    value: 510,  fill: '#f59e0b' },
    { name: 'Negotiation', value: 280,  fill: '#f97316' },
    { name: 'Won',         value: 347,  fill: '#10b981' },
  ],
  sources: [
    { name: 'Website',    value: 35, color: '#6640ff' },
    { name: 'Referral',   value: 28, color: '#3b82f6' },
    { name: 'LinkedIn',   value: 18, color: '#06b6d4' },
    { name: 'Google Ads', value: 12, color: '#10b981' },
    { name: 'Other',      value: 7,  color: '#f59e0b' },
  ],
  activity: [
    { type: 'lead',     text: 'New lead from Priya Sharma via Website', time: Date.now() - 120000 },
    { type: 'won',      text: 'Deal closed with TechNova Pvt Ltd — ₹4.2L', time: Date.now() - 360000 },
    { type: 'followup', text: 'Follow-up due: Raj Mehta (Proposal stage)', time: Date.now() - 600000 },
    { type: 'ai',       text: 'AI scored 3 leads as High Priority', time: Date.now() - 1200000 },
    { type: 'lead',     text: 'New lead from IndiaMart integration', time: Date.now() - 1800000 },
    { type: 'update',   text: 'Pipeline updated by Sneha K', time: Date.now() - 3600000 },
  ],
  insights: [
    { icon: Star,          color: 'text-amber-400',   bg: 'bg-amber-500/10',   title: 'Top Lead Source', desc: 'Website brings 35% of leads — invest more in SEO.' },
    { icon: TrendingUp,    color: 'text-emerald-400', bg: 'bg-emerald-500/10', title: 'High-Value Leads', desc: '12 leads with deal value >₹5L are in Proposal stage.' },
    { icon: AlertTriangle, color: 'text-orange-400',  bg: 'bg-orange-500/10',  title: 'Drop-off Alert',   desc: '41% of leads drop off at Negotiation — review pricing.' },
  ],
}

const ACTIVITY_ICONS = {
  lead:     { emoji: '👤', color: 'bg-blue-500/20 text-blue-400' },
  won:      { emoji: '🏆', color: 'bg-emerald-500/20 text-emerald-400' },
  followup: { emoji: '📅', color: 'bg-amber-500/20 text-amber-400' },
  ai:       { emoji: '🤖', color: 'bg-velora-500/20 text-velora-400' },
  update:   { emoji: '✏️', color: 'bg-pink-500/20 text-pink-400' },
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-white/10 shadow-glass text-xs">
      <p className="text-dark-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white font-medium" style={{ color: p.color }}>
          {p.name}: {p.name === 'revenue' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsAPI.dashboard().then((r) => r.data),
    retry: false,
  })

  const KPI_CONFIG = {
    'Total Leads':     { icon: Users,       gradient: 'from-blue-500/20 to-blue-600/10',    iconColor: 'text-blue-400',    border: 'border-blue-500/20' },
    'Conversions':     { icon: TrendingUp,  gradient: 'from-emerald-500/20 to-emerald-600/10', iconColor: 'text-emerald-400', border: 'border-emerald-500/20' },
    'Revenue':         { icon: DollarSign,  gradient: 'from-velora-500/20 to-velora-600/10', iconColor: 'text-velora-400', border: 'border-velora-500/20' },
    'Conversion Rate': { icon: Percent,     gradient: 'from-pink-500/20 to-pink-600/10',    iconColor: 'text-pink-400',    border: 'border-pink-500/20' },
  }

  const kpis = (data?.kpis || MOCK.kpis).map(k => ({
    ...k,
    ...(KPI_CONFIG[k.label] || KPI_CONFIG['Total Leads'])
  }))
  const revenue   = data?.revenue   || MOCK.revenue
  const FUNNEL_COLORS = { 'New': '#3b82f6', 'Qualified': '#8b5cf6', 'Proposal': '#f59e0b', 'Negotiation': '#f97316', 'Won': '#10b981' }
  const SOURCE_COLORS = ['#6640ff', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']

  const funnel = (data?.funnel || MOCK.funnel).map(s => ({
    ...s,
    fill: FUNNEL_COLORS[s.name] || s.fill || '#64648a'
  }))
  const sources = (data?.sources || MOCK.sources).map((s, i) => ({
    ...s,
    color: s.color || SOURCE_COLORS[i % SOURCE_COLORS.length]
  }))
  const activity  = data?.activity  || MOCK.activity
  const insights  = data?.insights  || MOCK.insights

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-8"
    >
      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <SkeletonKPI key={i} />)
          : kpis.map((kpi, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, scale: 1.01 }}
              className={`glass rounded-2xl p-5 border ${kpi.border} relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-50`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-medium text-dark-400">{kpi.label}</p>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.gradient} bg-gradient-to-br`}>
                    <kpi.icon className={`w-4.5 h-4.5 ${kpi.iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-display font-bold text-white mb-1">
                  {kpi.isCurrency  ? formatCurrency(kpi.value)
                  : kpi.isPercent  ? `${kpi.value}%`
                  : kpi.value.toLocaleString()}
                </p>
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(kpi.change)}% vs last month
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue + Leads Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Revenue & Leads</h3>
              <p className="text-xs text-dark-400">Monthly performance overview</p>
            </div>
            <div className="flex gap-3 text-xs text-dark-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-velora-400 inline-block" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />Leads</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6640ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6640ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64648a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left"  tick={{ fill: '#64648a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64648a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left"  type="monotone" dataKey="revenue" stroke="#6640ff" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              <Area yAxisId="right" type="monotone" dataKey="leads"   stroke="#3b82f6" strokeWidth={2} fill="url(#leadGrad)" name="leads" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Sources Pie */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white mb-1">Lead Sources</h3>
          <p className="text-xs text-dark-400 mb-4">Distribution by channel</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={sources} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value" paddingAngle={3}>
                {sources.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(10,10,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {sources.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-dark-300">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-white">{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Funnel + Activity + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales Funnel */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white mb-1">Sales Funnel</h3>
          <p className="text-xs text-dark-400 mb-5">Lead progression by stage</p>
          <div className="space-y-3">
            {funnel.map((stage, i) => {
              const pct = Math.round((stage.value / funnel[0].value) * 100)
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-dark-300">{stage.name}</span>
                    <span className="text-white font-medium">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: stage.fill }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white">Live Activity</h3>
              <p className="text-xs text-dark-400">Real-time feed</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
            {activity.map((item, i) => {
              const config = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.update
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 items-start"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${config.color}`}>
                    {config.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-dark-200 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-dark-500 mt-0.5">{formatRelativeTime(item.time)}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #6640ff22, #3b82f622)' }}>
              <Zap className="w-4 h-4 text-velora-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm">AI Insights</h3>
              <p className="text-[10px] text-dark-400">Powered by Velora AI</p>
            </div>
          </div>
          <div className="space-y-3">
            {insights.map((ins, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`p-3 rounded-xl ${ins.bg} border border-white/[0.06]`}
              >
                <div className="flex gap-2.5 items-start">
                  <ins.icon className={`w-4 h-4 ${ins.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-xs font-semibold ${ins.color}`}>{ins.title}</p>
                    <p className="text-[11px] text-dark-300 mt-0.5 leading-relaxed">{ins.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
