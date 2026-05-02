import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      setAuth(data.user, data.token, data.workspace)
      toast.success(`Welcome back, ${data.user.name}! 👋`)
      navigate('/')
    } catch (err) {
      // handled globally by interceptor, but also set demo mode
    } finally {
      setLoading(false)
    }
  }

  // Demo login
  const demoLogin = async () => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email: 'demo@veloracrm.com', password: 'demo1234' })
      setAuth(data.user, data.token, data.workspace)
      toast.success('Demo mode activated! 🚀')
      navigate('/')
    } catch {
      // Fallback: set mock auth if backend not running
      setAuth(
        { _id: 'demo', name: 'Alex Rivera', email: 'demo@veloracrm.com', role: 'admin' },
        'demo-token',
        { _id: 'ws1', name: 'Velora Agency' }
      )
      toast.success('Demo mode activated! 🚀')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-[600px] h-[600px] bg-velora-600/10 -top-40 -left-40" />
      <div className="orb w-[400px] h-[400px] bg-blue-600/08 -bottom-20 -right-20" />
      <div className="orb w-[300px] h-[300px] bg-cyan-600/06 top-1/2 right-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-neon-purple"
               style={{ background: 'linear-gradient(135deg, #6640ff, #3b82f6)' }}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-gradient-neon mb-1">VeloraCRM</h1>
          <p className="text-dark-400 text-sm">AI-powered lead management for modern teams</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <h2 className="font-display font-semibold text-xl text-white mb-1">Welcome back</h2>
          <p className="text-dark-400 text-sm mb-6">Sign in to your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="you@company.com"
                  className="velora-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  name="password" type={showPass ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="velora-input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full btn-primary justify-center py-2.5 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 text-xs text-dark-500">or</span>
            </div>
          </div>

          <motion.button
            onClick={demoLogin} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full btn-secondary justify-center py-2.5 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-velora-400" />
            Try Demo — No signup needed
          </motion.button>

          <p className="text-center text-xs text-dark-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-velora-400 hover:text-velora-300 font-medium transition-colors">
              Create workspace
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
