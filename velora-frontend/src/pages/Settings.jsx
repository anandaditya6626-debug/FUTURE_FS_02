import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Building2, Bell, Shield, Key, Save, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const TABS = [
  { id:'profile',   label:'Profile',        icon: User },
  { id:'workspace', label:'Workspace',      icon: Building2 },
  { id:'security',  label:'Security',       icon: Shield },
  { id:'api',       label:'API & Keys',     icon: Key },
  { id:'notifs',    label:'Notifications',  icon: Bell },
]

export default function Settings() {
  const { user, workspace, updateUser } = useAuthStore()
  const [tab, setTab]     = useState('profile')
  const [profile, setProfile] = useState({ name: user?.name||'', email: user?.email||'' })
  const [showKey, setShowKey] = useState(false)
  const [twoFA, setTwoFA]    = useState(false)
  const [notifs, setNotifs]  = useState({ newLead:true, statusChange:true, followup:true, weekly:false, team:true })
  const apiKey = 'vl_live_sk_9f3a8b2c1d4e5f6g7h8i'

  return (
    <div className="pb-8 max-w-4xl">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-white">Settings</h2>
        <p className="text-xs text-dark-400 mt-0.5">Manage account and workspace preferences</p>
      </div>
      <div className="flex gap-6">
        <div className="w-44 flex-shrink-0 space-y-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab===t.id ? 'bg-velora-600/20 text-white border border-velora-500/30' : 'text-dark-400 hover:text-white hover:bg-white/5')}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 glass rounded-2xl p-6 space-y-5">
          {tab==='profile' && (
            <>
              <h3 className="font-semibold text-white">Profile</h3>
              {[{k:'name',l:'Full Name',t:'text'},{k:'email',l:'Email',t:'email'}].map(({k,l,t})=>(
                <div key={k}>
                  <label className="block text-xs font-medium text-dark-300 mb-1.5">{l}</label>
                  <input type={t} value={profile[k]} onChange={(e)=>setProfile({...profile,[k]:e.target.value})} className="velora-input text-sm"/>
                </div>
              ))}
              <button onClick={()=>{updateUser(profile);toast.success('Saved!')}} className="btn-primary text-sm py-2"><Save className="w-4 h-4"/>Save</button>
            </>
          )}

          {tab==='workspace' && (
            <>
              <h3 className="font-semibold text-white">Workspace</h3>
              <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Workspace Name</label><input defaultValue={workspace?.name||'My Workspace'} className="velora-input text-sm"/></div>
              <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Industry</label>
                <select className="velora-input text-sm">{['SaaS','Agency','Consulting','E-commerce','Real Estate','Other'].map((o)=><option key={o}>{o}</option>)}</select>
              </div>
              <div><label className="block text-xs font-medium text-dark-300 mb-1.5">Timezone</label>
                <select className="velora-input text-sm">{['Asia/Kolkata (IST)','UTC','America/New_York'].map((o)=><option key={o}>{o}</option>)}</select>
              </div>
              <button onClick={()=>toast.success('Saved!')} className="btn-primary text-sm py-2"><Save className="w-4 h-4"/>Save</button>
            </>
          )}

          {tab==='security' && (
            <>
              <h3 className="font-semibold text-white">Security</h3>
              <div className="space-y-3">
                {['Current Password','New Password','Confirm Password'].map((p)=>(
                  <input key={p} type="password" placeholder={p} className="velora-input text-sm"/>
                ))}
                <button onClick={()=>toast.success('Password updated!')} className="btn-primary text-sm py-2"><Shield className="w-4 h-4"/>Update Password</button>
              </div>
              <div className="border-t border-white/[0.06] pt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-dark-400 mt-0.5">Extra security for your account</p>
                </div>
                <button onClick={()=>{setTwoFA(!twoFA);toast.success(twoFA?'2FA disabled':'2FA enabled!')}}
                  className={cn('w-11 h-6 rounded-full transition-colors relative',twoFA?'bg-velora-500':'bg-dark-700')}>
                  <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-all',twoFA?'left-6':'left-1')}/>
                </button>
              </div>
              <div className="border-t border-white/[0.06] pt-5">
                <p className="text-sm font-medium text-white mb-3">Active Sessions</p>
                {[{dev:'Chrome · Windows · Mumbai',time:'Current',cur:true},{dev:'Safari · iPhone',time:'2d ago',cur:false}].map((s,i)=>(
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04]">
                    <div><p className="text-xs text-white">{s.dev}</p><p className="text-[10px] text-dark-500">{s.time}</p></div>
                    {s.cur ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">Current</span>
                    :<button onClick={()=>toast.success('Revoked')} className="text-[10px] text-red-400">Revoke</button>}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==='api' && (
            <>
              <h3 className="font-semibold text-white">API Keys & Webhooks</h3>
              <div className="p-4 bg-dark-800/60 rounded-xl border border-white/[0.06]">
                <p className="text-xs font-medium text-dark-300 mb-2">Live API Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-velora-300 font-mono">{showKey ? apiKey : '•'.repeat(28)}</code>
                  <button onClick={()=>setShowKey(!showKey)} className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white">
                    {showKey?<EyeOff className="w-3.5 h-3.5"/>:<Eye className="w-3.5 h-3.5"/>}
                  </button>
                  <button onClick={()=>{navigator.clipboard.writeText(apiKey);toast.success('Copied!')}} className="btn-secondary text-xs py-1.5">Copy</button>
                </div>
              </div>
              <div className="p-4 bg-dark-800/60 rounded-xl border border-white/[0.06]">
                <p className="text-xs font-medium text-dark-300 mb-2">Public Lead Endpoint</p>
                <code className="text-xs text-blue-300 font-mono">POST /api/public/lead</code>
                <p className="text-[10px] text-dark-500 mt-1">Submit leads from any external source using your API key.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-3">Webhooks</p>
                {['New Lead Created','Status Changed','Deal Won'].map((ev)=>(
                  <div key={ev} className="flex items-center gap-3 p-3 bg-dark-800/40 rounded-xl mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"/>
                    <span className="text-xs text-dark-200 flex-1">{ev}</span>
                    <button className="text-xs text-velora-400">Configure</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==='notifs' && (
            <>
              <h3 className="font-semibold text-white">Notifications</h3>
              {[
                {k:'newLead',l:'New Lead',d:'When a new lead is added'},
                {k:'statusChange',l:'Status Change',d:'When a lead status updates'},
                {k:'followup',l:'Follow-up Due',d:'Reminder for scheduled follow-ups'},
                {k:'weekly',l:'Weekly Report',d:'Weekly pipeline summary'},
                {k:'team',l:'Team Activity',d:'When teammates update shared leads'},
              ].map(({k,l,d})=>(
                <div key={k} className="flex items-center justify-between py-3 border-b border-white/[0.06]">
                  <div><p className="text-sm text-white">{l}</p><p className="text-xs text-dark-500">{d}</p></div>
                  <button onClick={()=>setNotifs({...notifs,[k]:!notifs[k]})}
                    className={cn('w-11 h-6 rounded-full transition-colors relative',notifs[k]?'bg-velora-500':'bg-dark-700')}>
                    <div className={cn('w-4 h-4 rounded-full bg-white absolute top-1 transition-all',notifs[k]?'left-6':'left-1')}/>
                  </button>
                </div>
              ))}
              <button onClick={()=>toast.success('Saved!')} className="btn-primary text-sm py-2 mt-2"><Save className="w-4 h-4"/>Save</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
