const logger = require('./logger')

// Rule-based AI engine (swappable with OpenAI)
const aiEngine = {
  calculateLeadScore(lead) {
    let score = 30
    const sourceScores = { linkedin: 20, referral: 18, website: 15, google_ads: 12, email: 10, instagram: 10, cold_call: 8, other: 5 }
    score += sourceScores[lead.source] || 5
    if (lead.dealValue > 1000000) score += 20
    else if (lead.dealValue > 500000) score += 15
    else if (lead.dealValue > 100000) score += 10
    else score += 5
    const stageScores = { Won: 25, Negotiation: 20, Proposal: 15, Qualified: 10, New: 5, Cold: 0, Lost: 0 }
    score += stageScores[lead.status] || 0
    if (lead.notes?.length > 2) score += 5
    if (lead.followUps?.length > 0) score += 5
    return Math.min(100, Math.max(1, score))
  },

  predictConversion(lead) {
    const score = this.calculateLeadScore(lead)
    const base = score * 0.8
    const stageMult = { Negotiation: 1.2, Proposal: 1.0, Qualified: 0.7, New: 0.4, Cold: 0.1, Won: 1.5, Lost: 0 }
    return Math.min(99, Math.round(base * (stageMult[lead.status] || 0.5)))
  },

  analyzeSentiment(text) {
    const positive = ['great','excellent','interested','love','perfect','yes','sure','definitely','excited','good']
    const negative = ['no','not','never','expensive','costly','problem','issue','concern','bad','poor']
    const t = text.toLowerCase()
    const pos = positive.filter((w) => t.includes(w)).length
    const neg = negative.filter((w) => t.includes(w)).length
    if (pos > neg) return { label: 'Positive', score: Math.min(0.95, 0.6 + pos * 0.1) }
    if (neg > pos) return { label: 'Negative', score: Math.min(0.95, 0.6 + neg * 0.1) }
    return { label: 'Neutral', score: 0.5 }
  },

  getNextBestAction(lead) {
    const actions = {
      New:         ['Send a personalised intro email', 'Connect on LinkedIn', 'Schedule a discovery call'],
      Qualified:   ['Send product demo video', 'Share relevant case study', 'Schedule live demo call'],
      Proposal:    ['Follow up on proposal (if 2+ days)', 'Share ROI calculator', 'Offer a trial or pilot'],
      Negotiation: ['Address price objection with ROI data', 'Create urgency with deadline', 'Involve a senior decision maker'],
      Cold:        ['Send re-engagement content', 'Try a different channel (WhatsApp)', 'Wait 30 days then retry'],
      Won:         ['Send onboarding checklist', 'Schedule kickoff call', 'Request a referral or review'],
      Lost:        ['Send a breakup email with open door', 'Mark for re-engagement in 90 days'],
    }
    return actions[lead.status] || ['Review lead details', 'Update status']
  },

  generateReply(lead, tone = 'professional') {
    const tones = {
      professional: `Hi ${lead.name},\n\nThank you for your interest in VeloraCRM. I'd love to schedule a quick call to understand your requirements and show you how we can help.\n\nWould any time this week work for you?\n\nBest regards`,
      friendly: `Hey ${lead.name}! 👋\n\nThanks for reaching out! Super excited to connect with you. Would love to show you what VeloraCRM can do for your team.\n\nWhat does your calendar look like this week? ✌️`,
      whatsapp: `Hi ${lead.name}! 😊 Thanks for your interest in VeloraCRM. Quick question — would you be open to a 15-min call this week to see if we're a good fit? 🚀`,
    }
    return tones[tone] || tones.professional
  },

  summarizeLead(lead) {
    return `**${lead.name}** from ${lead.company || 'Unknown Company'} is a ${lead.status} lead with a deal value of ₹${(lead.dealValue || 0).toLocaleString()}. Source: ${lead.source}. Lead score: ${this.calculateLeadScore(lead)}/100. Conversion probability: ${this.predictConversion(lead)}%. Recommended action: ${this.getNextBestAction(lead)[0]}.`
  },

  chat(messages) {
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || ''
    if (lastMsg.includes('score') || lastMsg.includes('priority')) return 'Based on your pipeline, leads from LinkedIn with deal values >₹5L have the highest conversion probability. I recommend prioritising Kavita Nair (score: 91) and Kiran Reddy (score: 83) this week.'
    if (lastMsg.includes('revenue') || lastMsg.includes('forecast')) return 'Your Q2 revenue forecast is ₹28.4L based on current pipeline velocity. The Proposal stage has ₹37L+ in active deals. Closing 60% would exceed your quarterly target.'
    if (lastMsg.includes('email') || lastMsg.includes('reply')) return 'Here\'s a professional follow-up template:\n\nHi [Name],\n\nJust following up on our last conversation. Would love to answer any questions and move things forward.\n\nAre you available for a quick 20-min call this week?\n\nBest regards'
    return 'I\'ve analysed your CRM data. Your pipeline is healthy with 1,284 total leads and a 27% conversion rate. The biggest opportunity is in your Proposal stage — 3 high-value leads have been waiting >5 days for follow-up. Want me to draft outreach messages for them?'
  }
}

module.exports = aiEngine
