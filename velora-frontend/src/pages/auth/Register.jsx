import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Building2, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm]         = useState({ name: '', email: '', password: '', workspaceName: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      setAuth(data.user, data.token, data.workspace)
      toast.success('Workspace created! Welcome to VeloraCRM 🚀')
      navigate('/')
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name',          icon: User,      type: 'text',     placeholder: 'Alex Rivera',           label: 'Full Name' },
    { name: 'workspaceName', icon: Building2, type: 'text',     placeholder: 'My Agency',             label: 'Workspace Name' },
    { name: 'email',         icon: Mail,      type: 'email',    placeholder: 'you@company.com',       label: 'Work Email' },
    { name: 'password',      icon: Lock,      type: 'password', placeholder: 'Min 8 characters',      label: 'Password' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-blue-600/08 -top-40 -right-40" />
      <div className="orb w-[400px] h-[400px] bg-velora-600/10 -bottom-20 -left-20" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-neon-purple"
               style={{ background: 'linear-gradient(135deg, #6640ff, #3b82f6)' }}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-gradient-neon mb-1">VeloraCRM</h1>
          <p className="text-dark-400 text-sm">Create your workspace in 30 seconds</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <h2 className="font-display font-semibold text-xl text-white mb-1">Create workspace</h2>
          <p className="text-dark-400 text-sm mb-6">Start managing leads like a ₹5Cr startup</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, icon: Icon, type, placeholder, label }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                  <input
                    name={name}
                    type={name === 'password' ? (showPass ? 'text' : 'password') : type}
                    required value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="velora-input pl-10"
                  />
                  {name === 'password' && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full btn-primary justify-center py-2.5 text-sm font-semibold mt-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Creating workspace...' : 'Create Workspace'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-dark-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-velora-400 hover:text-velora-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
