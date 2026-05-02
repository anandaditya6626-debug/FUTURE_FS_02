import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong'
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } else if (err.response?.status !== 404) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
  enable2FA:()     => api.post('/auth/2fa/enable'),
  verify2FA:(token)=> api.post('/auth/2fa/verify', { token }),
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export const leadsAPI = {
  getAll:    (params) => api.get('/leads', { params }),
  getOne:    (id)     => api.get(`/leads/${id}`),
  create:    (data)   => api.post('/leads', data),
  update:    (id, d)  => api.put(`/leads/${id}`, d),
  delete:    (id)     => api.delete(`/leads/${id}`),
  bulkDelete:(ids)    => api.post('/leads/bulk-delete', { ids }),
  bulkUpdate:(ids, d) => api.post('/leads/bulk-update', { ids, data: d }),
  addNote:   (id, d)  => api.post(`/leads/${id}/notes`, d),
  addFollowup:(id, d) => api.post(`/leads/${id}/followups`, d),
  addActivity:(id, d) => api.post(`/leads/${id}/activity`, d),
  importCSV: (form)   => api.post('/leads/import', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  exportCSV: (params) => api.get('/leads/export', { params, responseType: 'blob' }),
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
export const pipelineAPI = {
  getAll:     ()       => api.get('/pipeline'),
  create:     (data)   => api.post('/pipeline', data),
  update:     (id, d)  => api.put(`/pipeline/${id}`, d),
  delete:     (id)     => api.delete(`/pipeline/${id}`),
  moveCard:   (data)   => api.post('/pipeline/move', data),
  getStages:  ()       => api.get('/pipeline/stages'),
}

// ── Analytics ────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  dashboard:  () => api.get('/analytics/dashboard'),
  funnel:     () => api.get('/analytics/funnel'),
  revenue:    () => api.get('/analytics/revenue'),
  sources:    () => api.get('/analytics/sources'),
  team:       () => api.get('/analytics/team'),
  forecast:   () => api.get('/analytics/forecast'),
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:  (params) => api.get('/tasks', { params }),
  create:  (data)   => api.post('/tasks', data),
  update:  (id, d)  => api.put(`/tasks/${id}`, d),
  delete:  (id)     => api.delete(`/tasks/${id}`),
}

// ── Team / Workspace ──────────────────────────────────────────────────────────
export const teamAPI = {
  getMembers:  () => api.get('/workspace/members'),
  inviteMember:(d) => api.post('/workspace/invite', d),
  updateRole:  (id, r) => api.put(`/workspace/members/${id}/role`, { role: r }),
  removeMember:(id) => api.delete(`/workspace/members/${id}`),
  getWorkspace:() => api.get('/workspace'),
  updateWorkspace:(d) => api.put('/workspace', d),
}

// ── Automations ───────────────────────────────────────────────────────────────
export const automationAPI = {
  getAll:   () => api.get('/automation'),
  create:   (d) => api.post('/automation', d),
  update:   (id, d) => api.put(`/automation/${id}`, d),
  delete:   (id)    => api.delete(`/automation/${id}`),
  toggle:   (id)    => api.post(`/automation/${id}/toggle`),
}

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat:          (messages) => api.post('/ai/chat', { messages }),
  summarizeLead: (leadId)   => api.post('/ai/summarize', { leadId }),
  generateReply: (data)     => api.post('/ai/reply', data),
  predictScore:  (leadId)   => api.post('/ai/predict', { leadId }),
  nextBestAction:(leadId)   => api.post('/ai/next-action', { leadId }),
}

// ── Communications ────────────────────────────────────────────────────────────
export const commsAPI = {
  getLogs:     (params) => api.get('/communications', { params }),
  addLog:      (d)      => api.post('/communications', d),
  getTemplates:()       => api.get('/communications/templates'),
  createTemplate:(d)    => api.post('/communications/templates', d),
}

// ── Public API keys ───────────────────────────────────────────────────────────
export const publicAPI = {
  getKeys:    () => api.get('/public-api/keys'),
  generateKey:() => api.post('/public-api/keys'),
  revokeKey:  (id) => api.delete(`/public-api/keys/${id}`),
  getWebhooks:() => api.get('/public-api/webhooks'),
  createWebhook:(d) => api.post('/public-api/webhooks', d),
  deleteWebhook:(id) => api.delete(`/public-api/webhooks/${id}`),
}

export default api
