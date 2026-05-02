import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, TrendingUp, MessageSquare, Zap, User, RefreshCw, Copy } from 'lucide-react'
import { cn } from '../lib/utils'
import toast from 'react-hot-toast'

const INIT_MESSAGES = [
  { role: 'assistant', text: "Hi! I'm Velora AI 🤖 — your intelligent sales assistant. I can help you:\n\n• **Summarize leads** and their history\n• **Generate email/WhatsApp replies**\n• **Predict conversion probability**\n• **Suggest next best actions**\n• **Analyse sentiment** from conversations\n\nWhat would you like to do today?" }
]

const QUICK_ACTIONS = [
  { icon: TrendingUp,    label: 'Predict conversion',    prompt: 'Predict the conversion probability for Kavita Nair from RetailBrand.' },
  { icon: MessageSquare, label: 'Generate email reply',  prompt: 'Generate a professional follow-up email for Kavita Nair after sending the proposal.' },
  { icon: Sparkles,      label: 'Summarize top leads',   prompt: 'Summarize my top 3 highest-scoring leads and their current status.' },
  { icon: Zap,           label: 'Next best action',      prompt: 'What is the next best action I should take for leads in the Negotiation stage?' },
]

const AI_RESPONSES = {
  default: "Great question! Based on your CRM data, here's what I found:\n\n📊 **Analysis complete**\n\nYour pipeline shows strong momentum in Q2. The Proposal stage has the highest deal value concentration at ₹37L+. I recommend prioritising Kavita Nair (score: 91) and Kiran Reddy (score: 83) this week.\n\n**Next Best Actions:**\n1. Follow up with Kavita Nair — proposal sent 1 day ago\n2. Schedule demo for Rohit Verma (Negotiation stage)\n3. Re-engage Meera Iyer with personalised content\n\nWould you like me to draft outreach messages for any of these leads?",
  conversion: "🔮 **Conversion Prediction: Kavita Nair**\n\n**Conversion Probability: 87%** ✅ High\n\n**Key Signals:**\n• Lead Score: 91/100 (Excellent)\n• Deal Value: ₹12,00,000 (High intent)\n• Stage: Proposal (advanced)\n• Engagement: 3 touchpoints in 8 days\n• Source: LinkedIn (quality channel)\n\n**Risk Factors:**\n• No response to proposal yet (1 day)\n• Competitive market (Enterprise retail)\n\n**Recommendation:** Send a gentle follow-up today with a value-add (ROI calculator or case study).",
  email: "📧 **Generated Email — Follow-up After Proposal**\n\n---\n**Subject:** Quick check-in on RetailBrand x Velora proposal\n\nHi Kavita,\n\nHope this finds you well! I wanted to follow up on the proposal I shared yesterday for RetailBrand's CRM implementation.\n\nTo recap the key value we're bringing:\n✅ 40% faster lead response time\n✅ AI-powered lead scoring\n✅ Full omnichannel communication hub\n\nI'd love to address any questions or walk you through a live demo at your convenience. Would **Thursday at 3 PM IST** work for a 30-min call?\n\nLooking forward to connecting!\n\nWarm regards,\nRaj Kumar\nVeloraCRM Team\n\n---\n*Tone: Professional · Channel: Email · Optimised for B2B enterprise*",
  summary: "📋 **Top 3 Lead Summary**\n\n**1. Kavita Nair** — RetailBrand Solutions\n• Score: 91 · Stage: Proposal · Deal: ₹12L\n• Status: Proposal sent yesterday. High conversion probability.\n\n**2. Kiran Reddy** — RealEstate Corp\n• Score: 83 · Stage: Proposal · Deal: ₹25L\n• Status: Largest deal in pipeline. Needs personalised attention.\n\n**3. Priya Sharma** — TechStartup\n• Score: 85 · Stage: New · Deal: ₹4.5L\n• Status: Fresh lead, high score. Qualify immediately.\n\n**Combined Pipeline Value: ₹41.5L**\n\n*Insight: All 3 leads are in early-to-mid stages. Closing even 2 of these would exceed your monthly target by 180%.*",
  action: "⚡ **Next Best Actions — Negotiation Stage**\n\n**Lead: Rohit Verma (FinTech)**\n\n1. **Address Price Objection** — Offer a 10% introductory discount valid for 5 days to create urgency.\n2. **Send ROI Report** — Share a custom ROI calculator showing 6-month payback period.\n3. **Involve Decision Maker** — Request a call including their CTO/CFO.\n4. **Set Hard Deadline** — Proposal expires in 7 days; create gentle urgency.\n\n**Predicted Outcome if actioned:** Conversion probability increases from 68% → 84%\n\n*Best time to reach out: Tuesday/Wednesday, 10–11 AM IST (based on engagement patterns)*",
}

function getAIResponse(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('predict') || p.includes('conversion') || p.includes('probability')) return AI_RESPONSES.conversion
  if (p.includes('email') || p.includes('reply') || p.includes('message') || p.includes('whatsapp')) return AI_RESPONSES.email
  if (p.includes('summar') || p.includes('top lead') || p.includes('overview')) return AI_RESPONSES.summary
  if (p.includes('next') || p.includes('action') || p.includes('negotiation')) return AI_RESPONSES.action
  return AI_RESPONSES.default
}

function MessageBubble({ msg, index }) {
  const isAI = msg.role === 'assistant'
  return (
    <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.05 }}
      className={cn('flex gap-3', !isAI && 'flex-row-reverse')}>
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm',
        isAI ? 'bg-velora-600/30 text-velora-400' : 'bg-dark-700 text-white')}>
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className={cn('max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
        isAI ? 'glass border border-white/[0.08] text-dark-100' : 'bg-velora-600/30 border border-velora-500/30 text-white')}>
        {msg.text.split('\n').map((line, i) => {
          const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          return <p key={i} className={line === '' ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: bold }} />
        })}
        {isAI && (
          <button onClick={() => { navigator.clipboard.writeText(msg.text); toast.success('Copied!') }}
            className="mt-2 flex items-center gap-1 text-[10px] text-dark-500 hover:text-velora-400 transition-colors">
            <Copy className="w-3 h-3" />Copy
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setThinking(true)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
    setThinking(false)
    setMessages((m) => [...m, { role: 'assistant', text: getAIResponse(msg) }])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neon-purple"
               style={{ background: 'linear-gradient(135deg, #6640ff, #3b82f6)' }}>
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white">Velora AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-400">Online · GPT-powered simulation</p>
            </div>
          </div>
        </div>
        <button onClick={() => setMessages(INIT_MESSAGES)} className="btn-ghost text-xs">
          <RefreshCw className="w-3.5 h-3.5" />Reset
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide flex-shrink-0">
        {QUICK_ACTIONS.map((a) => (
          <button key={a.label} onClick={() => sendMessage(a.prompt)}
            className="flex items-center gap-2 px-3 py-2 glass rounded-xl text-xs text-dark-300 hover:text-white hover:border-velora-500/30 transition-all whitespace-nowrap flex-shrink-0">
            <a.icon className="w-3.5 h-3.5 text-velora-400" />
            {a.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 glass rounded-2xl p-5 mb-4">
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} index={i} />)}
        {thinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-velora-600/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-velora-400" />
            </div>
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0,1,2].map((i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-velora-400"
                  animate={{ y:[0,-4,0] }} transition={{ duration:0.6, repeat:Infinity, delay:i*0.15 }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask anything about your leads, pipeline, or get AI suggestions..."
          className="velora-input flex-1" disabled={thinking} />
        <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
          onClick={() => sendMessage()} disabled={!input.trim() || thinking}
          className="btn-primary px-4 py-2.5 disabled:opacity-50">
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
