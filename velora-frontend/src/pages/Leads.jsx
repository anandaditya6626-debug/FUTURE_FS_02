import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Download, Upload, Trash2, X, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import toast from 'react-hot-toast'
import { leadsAPI } from '../services/api'
import { formatCurrency, formatRelativeTime, STATUS_CONFIG, SOURCE_LABELS, getScoreColor, getInitials, generateColor } from '../lib/utils'
import { cn } from '../lib/utils'
import Modal from '../components/ui/Modal'
import { SkeletonTable } from '../components/ui/Skeleton'

const MOCK_LEADS = [
  { _id:'1', name:'Priya Sharma',  email:'priya@techstartup.io',   phone:'+91 98765 43210', source:'website',   status:'New',        score:85, tags:['hot','saas'],      dealValue:450000,  assignedTo:{name:'Raj K'},   createdAt:new Date(Date.now()-86400000*2) },
  { _id:'2', name:'Arjun Mehta',   email:'arjun@designco.in',      phone:'+91 87654 32109', source:'referral',  status:'Qualified',  score:72, tags:['agency'],          dealValue:280000,  assignedTo:{name:'Sneha M'}, createdAt:new Date(Date.now()-86400000*5) },
  { _id:'3', name:'Kavita Nair',   email:'kavita@retailbrand.com', phone:'+91 76543 21098', source:'linkedin',  status:'Proposal',   score:91, tags:['enterprise','hot'],dealValue:1200000, assignedTo:{name:'Raj K'},   createdAt:new Date(Date.now()-86400000*8) },
  { _id:'4', name:'Rohit Verma',   email:'rohit@fintech.io',       phone:'+91 65432 10987', source:'google_ads',status:'Negotiation',score:68, tags:['fintech'],         dealValue:750000,  assignedTo:{name:'Dev P'},   createdAt:new Date(Date.now()-86400000*12) },
  { _id:'5', name:'Anjali Singh',  email:'anjali@ecom.in',         phone:'+91 54321 09876', source:'instagram', status:'Won',        score:94, tags:['ecommerce','vip'], dealValue:320000,  assignedTo:{name:'Sneha M'}, createdAt:new Date(Date.now()-86400000*15) },
  { _id:'6', name:'Vikram Bose',   email:'vikram@logistix.com',    phone:'+91 43210 98765', source:'cold_call', status:'Lost',       score:34, tags:['logistics'],       dealValue:180000,  assignedTo:{name:'Dev P'},   createdAt:new Date(Date.now()-86400000*20) },
  { _id:'7', name:'Meera Iyer',    email:'meera@healthtech.io',    phone:'+91 32109 87654', source:'website',   status:'New',        score:77, tags:['health','saas'],   dealValue:560000,  assignedTo:{name:'Raj K'},   createdAt:new Date(Date.now()-86400000*3) },
  { _id:'8', name:'Suresh Patel',  email:'suresh@manufact.in',     phone:'+91 21098 76543', source:'referral',  status:'Qualified',  score:61, tags:['b2b'],             dealValue:890000,  assignedTo:{name:'Sneha M'}, createdAt:new Date(Date.now()-86400000*7) },
  { _id:'9', name:'Pooja Gupta',   email:'pooja@edtech.com',       phone:'+91 10987 65432', source:'email',     status:'Cold',       score:28, tags:['edtech'],          dealValue:120000,  assignedTo:{name:'Dev P'},   createdAt:new Date(Date.now()-86400000*25) },
  { _id:'10',name:'Kiran Reddy',   email:'kiran@realestate.io',    phone:'+91 99876 54321', source:'website',   status:'Proposal',   score:83, tags:['realty','hot'],    dealValue:2500000, assignedTo:{name:'Raj K'},   createdAt:new Date(Date.now()-86400000*9) },
]

export default function Leads() {
  const navigate    = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch]      = useState('')
  const [selectedIds, setSelected] = useState([])
  const [filterStatus, setFilter]= useState('')
  const [addOpen, setAddOpen]    = useState(false)
  const [newLead, setNewLead]    = useState({ name:'', email:'', phone:'', source:'website', status:'New', dealValue:'' })

  const { data, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsAPI.getAll().then((r) => r.data.leads),
    retry: false,
  })
  const leads = data || MOCK_LEADS

  const createMutation = useMutation({
    mutationFn: (d) => leadsAPI.create(d),
    onSuccess: () => { queryClient.invalidateQueries(['leads']); toast.success('Lead added!'); setAddOpen(false) },
    onError: () => { toast.success('Lead added (demo)'); setAddOpen(false) },
  })
  const deleteMutation = useMutation({
    mutationFn: (ids) => leadsAPI.bulkDelete(ids),
    onSuccess: () => { queryClient.invalidateQueries(['leads']); toast.success('Deleted'); setSelected([]) },
    onError: () => { toast.success('Deleted (demo)'); setSelected([]) },
  })

  const fuse = useMemo(() => new Fuse(leads, { keys:['name','email','phone','source','status'], threshold:0.3 }), [leads])
  const filtered = useMemo(() => {
    let r = search ? fuse.search(search).map((x) => x.item) : leads
    if (filterStatus) r = r.filter((l) => l.status === filterStatus)
    return r
  }, [search, filterStatus, leads, fuse])

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((i) => i !== id) : [...s, id])
  const toggleAll = () => setSelected(selectedIds.length === filtered.length ? [] : filtered.map((l) => l._id))

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Leads</h2>
          <p className="text-xs text-dark-400 mt-0.5">{filtered.length} leads found</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm py-2"><Upload className="w-4 h-4" />Import</button>
          <button className="btn-secondary text-sm py-2"><Download className="w-4 h-4" />Export</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={() => setAddOpen(true)} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" />Add Lead
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Fuzzy search leads..." className="velora-input pl-9 py-2 text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <select value={filterStatus} onChange={(e) => setFilter(e.target.value)} className="velora-input py-2 text-sm w-auto">
          <option value="">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-velora-500/30">
            <span className="text-sm text-velora-300 font-medium">{selectedIds.length} selected</span>
            <button onClick={() => deleteMutation.mutate(selectedIds)} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300">
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
            <button onClick={() => setSelected([])} className="ml-auto text-dark-500 hover:text-white"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? <SkeletonTable rows={8} cols={7} /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="velora-table w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-3.5 h-3.5 accent-velora-500 cursor-pointer" />
                  </th>
                  {['Name','Email','Source','Status','Score','Deal Value','Assigned','Added',''].map((h) => (
                    <th key={h} className="text-dark-400 font-medium text-xs uppercase tracking-wider px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const cfg = STATUS_CONFIG[lead.status] || {}
                  return (
                    <motion.tr key={lead._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }} className="group border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-4 py-3 w-10">
                        <input type="checkbox" checked={selectedIds.includes(lead._id)} onChange={() => toggleSelect(lead._id)} className="w-3.5 h-3.5 accent-velora-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', generateColor(lead.name))}>
                            {getInitials(lead.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{lead.name}</p>
                            <p className="text-[11px] text-dark-500">{lead.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-dark-300 text-xs">{lead.email}</td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-dark-700 text-dark-300">{SOURCE_LABELS[lead.source] || lead.source}</span></td>
                      <td className="px-4 py-3"><span className={cn('text-xs px-2 py-0.5 rounded-full', cfg.className)}>{lead.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                            <div className={cn('h-full rounded-full bg-gradient-to-r', getScoreColor(lead.score))} style={{ width:`${lead.score}%` }} />
                          </div>
                          <span className="text-xs text-white font-medium">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">{formatCurrency(lead.dealValue)}</td>
                      <td className="px-4 py-3">
                        {lead.assignedTo && (
                          <div className="flex items-center gap-1.5">
                            <div className={cn('w-6 h-6 rounded-lg bg-gradient-to-br text-white text-[10px] font-bold flex items-center justify-center', generateColor(lead.assignedTo.name))}>
                              {getInitials(lead.assignedTo.name)}
                            </div>
                            <span className="text-xs text-dark-300">{lead.assignedTo.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-dark-400">{formatRelativeTime(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/leads/${lead._id}`)} className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-dark-500">
                <p className="text-sm">No leads found</p>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Lead" subtitle="Fill in the lead details">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(newLead) }} className="space-y-4">
          {[{n:'name',l:'Name',t:'text',p:'Full Name'},{n:'email',l:'Email',t:'email',p:'email@co.com'},{n:'phone',l:'Phone',t:'tel',p:'+91...'},{n:'dealValue',l:'Deal Value (₹)',t:'number',p:'500000'}].map(({n,l,t,p}) => (
            <div key={n}>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">{l}</label>
              <input type={t} placeholder={p} value={newLead[n]} onChange={(e) => setNewLead({...newLead,[n]:e.target.value})} className="velora-input text-sm" required={n==='name'||n==='email'} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Source</label>
              <select value={newLead.source} onChange={(e) => setNewLead({...newLead,source:e.target.value})} className="velora-input text-sm">
                {Object.entries(SOURCE_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Status</label>
              <select value={newLead.status} onChange={(e) => setNewLead({...newLead,status:e.target.value})} className="velora-input text-sm">
                {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-secondary flex-1 justify-center py-2.5">Cancel</button>
            <motion.button type="submit" whileHover={{scale:1.01}} whileTap={{scale:0.99}} className="btn-primary flex-1 justify-center py-2.5">
              <Plus className="w-4 h-4" />{createMutation.isPending ? 'Adding...' : 'Add Lead'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
