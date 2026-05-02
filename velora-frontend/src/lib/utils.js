import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG = {
  New:          { label: 'New',          className: 'badge-new',         color: '#3b82f6' },
  Qualified:    { label: 'Qualified',    className: 'badge-qualified',   color: '#8b5cf6' },
  Proposal:     { label: 'Proposal',     className: 'badge-proposal',    color: '#f59e0b' },
  Negotiation:  { label: 'Negotiation',  className: 'badge-negotiation', color: '#f97316' },
  Won:          { label: 'Won',          className: 'badge-won',         color: '#10b981' },
  Lost:         { label: 'Lost',         className: 'badge-lost',        color: '#ef4444' },
  Cold:         { label: 'Cold',         className: 'badge-cold',        color: '#64748b' },
}

export const SOURCE_LABELS = {
  website:    'Website',
  referral:   'Referral',
  linkedin:   'LinkedIn',
  instagram:  'Instagram',
  facebook:   'Facebook',
  google_ads: 'Google Ads',
  email:      'Email Campaign',
  cold_call:  'Cold Call',
  other:      'Other',
}

export const ROLE_CONFIG = {
  admin:   { label: 'Admin',   color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30' },
  manager: { label: 'Manager', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30' },
  sales:   { label: 'Sales',   color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30' },
}

export function formatCurrency(value, currency = '₹') {
  if (!value && value !== 0) return '—'
  if (value >= 10000000) return `${currency}${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000)   return `${currency}${(value / 100000).toFixed(1)}L`
  if (value >= 1000)     return `${currency}${(value / 1000).toFixed(1)}K`
  return `${currency}${value.toLocaleString()}`
}

export function formatDate(date, opts = {}) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', ...opts
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  if (minutes < 1)   return 'just now'
  if (minutes < 60)  return `${minutes}m ago`
  if (hours   < 24)  return `${hours}h ago`
  if (days    < 7)   return `${days}d ago`
  return formatDate(date)
}

export function getScoreColor(score) {
  if (score >= 80) return 'from-emerald-500 to-teal-400'
  if (score >= 60) return 'from-blue-500 to-cyan-400'
  if (score >= 40) return 'from-amber-500 to-yellow-400'
  return 'from-red-500 to-orange-400'
}

export function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

export function generateColor(str = '') {
  const colors = [
    'from-purple-500 to-violet-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export function debounce(fn, delay) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

export const PIPELINE_STAGES = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
export const LEAD_SOURCES    = Object.keys(SOURCE_LABELS)
export const LEAD_STATUSES   = Object.keys(STATUS_CONFIG)
