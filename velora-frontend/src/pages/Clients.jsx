import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Plus, FileText, DollarSign, Download, Eye } from 'lucide-react'
import { formatCurrency, formatDate, getInitials, generateColor } from '../lib/utils'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const MOCK_CLIENTS = [
  { id:'1', name:'Anjali Singh',   company:'EcomCo',           email:'anjali@ecom.in',       dealValue:320000,  status:'Active',   invoices:3, paidTotal:280000,  startDate: new Date('2026-02-15') },
  { id:'2', name:'Kavita Nair',    company:'RetailBrand',      email:'kavita@retailbrand.com',dealValue:1200000, status:'Active',   invoices:1, paidTotal:400000,  startDate: new Date('2026-03-01') },
  { id:'3', name:'Kiran Reddy',    company:'RealEstate Corp',  email:'kiran@realestate.io',  dealValue:2500000, status:'Onboarding',invoices:0,paidTotal:0,       startDate: new Date('2026-04-20') },
  { id:'4', name:'Arjun Mehta',    company:'DesignCo',         email:'arjun@designco.in',    dealValue:280000,  status:'Active',   invoices:2, paidTotal:280000,  startDate: new Date('2026-01-10') },
]

const MOCK_INVOICES = [
  { id:'INV-001', client:'Anjali Singh', amount:120000, status:'Paid',    due: new Date('2026-03-01'), issued: new Date('2026-02-15') },
  { id:'INV-002', client:'Anjali Singh', amount:100000, status:'Paid',    due: new Date('2026-04-01'), issued: new Date('2026-03-15') },
  { id:'INV-003', client:'Anjali Singh', amount:100000, status:'Pending', due: new Date('2026-05-15'), issued: new Date('2026-04-30') },
  { id:'INV-004', client:'Kavita Nair',  amount:400000, status:'Paid',    due: new Date('2026-04-01'), issued: new Date('2026-03-01') },
  { id:'INV-005', client:'Arjun Mehta',  amount:280000, status:'Overdue', due: new Date('2026-04-20'), issued: new Date('2026-03-20') },
]

const STATUS_CFG = {
  Active:     'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Onboarding: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Paused:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
}
const INV_CFG = {
  Paid:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Overdue: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function Clients() {
  const [view, setView] = useState('clients')

  return (
    <div className="pb-8 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Clients & Billing</h2>
          <p className="text-xs text-dark-400 mt-0.5">Converted leads and invoice management</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary text-sm py-2" onClick={() => toast.success('Invoice created!')}><Plus className="w-4 h-4"/>New Invoice</button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 glass rounded-xl p-1 w-fit">
        {['clients','invoices'].map((v) => (
          <button key={v} onClick={() => setView(v)}
            className={cn('px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
              view===v ? 'bg-velora-600/30 text-white' : 'text-dark-400 hover:text-white')}>
            {v}
          </button>
        ))}
      </div>

      {view==='clients' && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label:'Total Clients',   val: MOCK_CLIENTS.length,                                              color:'text-blue-400' },
              { label:'Total ACV',       val: formatCurrency(MOCK_CLIENTS.reduce((s,c)=>s+c.dealValue,0)),      color:'text-velora-400' },
              { label:'Revenue Collected',val: formatCurrency(MOCK_CLIENTS.reduce((s,c)=>s+c.paidTotal,0)),    color:'text-emerald-400' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4">
                <p className="text-xs text-dark-400">{s.label}</p>
                <p className={cn('text-xl font-display font-bold mt-1', s.color)}>{s.val}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Client','Company','Deal Value','Collected','Invoices','Status','Since',''].map((h) => (
                      <th key={h} className="text-dark-400 font-medium text-xs uppercase tracking-wider px-4 py-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CLIENTS.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', generateColor(c.name))}>
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm">{c.name}</p>
                            <p className="text-[11px] text-dark-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-dark-300">{c.company}</td>
                      <td className="px-4 py-3 text-sm font-bold text-white">{formatCurrency(c.dealValue)}</td>
                      <td className="px-4 py-3 text-sm text-emerald-400 font-medium">{formatCurrency(c.paidTotal)}</td>
                      <td className="px-4 py-3 text-xs text-dark-300">{c.invoices} invoices</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border', STATUS_CFG[c.status])}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-dark-400">{formatDate(c.startDate)}</td>
                      <td className="px-4 py-3">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white">
                          <Eye className="w-3.5 h-3.5"/>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view==='invoices' && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex justify-between items-center">
            <h3 className="font-semibold text-white text-sm">Invoices</h3>
            <div className="flex gap-3 text-xs text-dark-400">
              <span>Outstanding: <span className="text-red-400 font-semibold">{formatCurrency(MOCK_INVOICES.filter(i=>i.status!=='Paid').reduce((s,i)=>s+i.amount,0))}</span></span>
              <span>Collected: <span className="text-emerald-400 font-semibold">{formatCurrency(MOCK_INVOICES.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0))}</span></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Invoice','Client','Amount','Issued','Due','Status',''].map((h) => (
                    <th key={h} className="text-dark-400 font-medium text-xs uppercase tracking-wider px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_INVOICES.map((inv, i) => (
                  <motion.tr key={inv.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.05 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-velora-400"/>
                        <span className="font-mono text-xs text-velora-300">{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-300">{inv.client}</td>
                    <td className="px-4 py-3 text-sm font-bold text-white">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3 text-xs text-dark-400">{formatDate(inv.issued)}</td>
                    <td className="px-4 py-3 text-xs text-dark-400">{formatDate(inv.due)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border', INV_CFG[inv.status])}>{inv.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toast.success('Downloading...')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white">
                        <Download className="w-3.5 h-3.5"/>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
