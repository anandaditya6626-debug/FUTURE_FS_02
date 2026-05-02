const Lead = require('../models/Lead')

exports.getDashboard = async (req, res, next) => {
  try {
    const wid = req.user.workspaceId

    if (global.DEMO_MODE) {
      return res.json({
        kpis: [
          { label: 'Total Leads', value: 1284, change: 12.5 },
          { label: 'Conversions', value: 347, change: 8.2 },
          { label: 'Revenue', value: 2840000, change: 22.1, isCurrency: true },
          { label: 'Conversion Rate', value: 27, change: -2.3, isPercent: true },
        ],
        funnel: [
          { name: 'New', value: 1284 },
          { name: 'Qualified', value: 842 },
          { name: 'Proposal', value: 510 },
          { name: 'Negotiation', value: 280 },
          { name: 'Won', value: 347 },
        ],
        sources: [
          { name: 'LinkedIn', value: 45 },
          { name: 'Website', value: 30 },
          { name: 'Referral', value: 15 },
          { name: 'Google Ads', value: 10 },
        ]
      })
    }

    const [total, won, leads] = await Promise.all([
      Lead.countDocuments({ workspaceId: wid }),
      Lead.countDocuments({ workspaceId: wid, status: 'Won' }),
      Lead.find({ workspaceId: wid }).select('status source dealValue score createdAt'),
    ])

    const revenue = leads.filter((l) => l.status === 'Won').reduce((s, l) => s + (l.dealValue || 0), 0)
    const convRate = total > 0 ? Math.round((won / total) * 100 * 10) / 10 : 0

    const statusCounts = {}
    const sourceCounts = {}
    leads.forEach((l) => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1
    })

    const funnel = ['New','Qualified','Proposal','Negotiation','Won'].map((s) => ({
      name: s, value: statusCounts[s] || 0,
    }))

    const sourceTotal = Object.values(sourceCounts).reduce((a, b) => a + b, 0)
    const sources = Object.entries(sourceCounts).map(([name, val]) => ({
      name, value: sourceTotal > 0 ? Math.round((val / sourceTotal) * 100) : 0,
    })).sort((a, b) => b.value - a.value).slice(0, 5)

    res.json({ kpis: [
      { label:'Total Leads',     value: total,    change: 12.5 },
      { label:'Conversions',     value: won,      change: 8.2 },
      { label:'Revenue',         value: revenue,  change: 22.1, isCurrency: true },
      { label:'Conversion Rate', value: convRate, change: -2.3, isPercent: true },
    ], funnel, sources })
  } catch (err) { next(err) }
}

exports.getFunnel = async (req, res, next) => {
  try {
    const stages = ['New','Qualified','Proposal','Negotiation','Won','Lost']
    const counts = await Promise.all(stages.map((s) => Lead.countDocuments({ workspaceId: req.user.workspaceId, status: s })))
    res.json(stages.map((s, i) => ({ stage: s, count: counts[i] })))
  } catch (err) { next(err) }
}

exports.getRevenue = async (req, res, next) => {
  try {
    const leads = await Lead.find({ workspaceId: req.user.workspaceId, status: 'Won' }).select('dealValue createdAt')
    const monthly = {}
    leads.forEach((l) => {
      const key = new Date(l.createdAt).toLocaleString('en', { month: 'short' })
      monthly[key] = (monthly[key] || 0) + (l.dealValue || 0)
    })
    res.json(Object.entries(monthly).map(([month, revenue]) => ({ month, revenue })))
  } catch (err) { next(err) }
}

exports.getTeamPerformance = async (req, res, next) => {
  try {
    const leads = await Lead.find({ workspaceId: req.user.workspaceId }).populate('assignedTo', 'name').select('assignedTo status dealValue')
    const teamMap = {}
    leads.forEach((l) => {
      if (!l.assignedTo) return
      const name = l.assignedTo.name
      if (!teamMap[name]) teamMap[name] = { name, closed: 0, value: 0, total: 0 }
      teamMap[name].total++
      if (l.status === 'Won') { teamMap[name].closed++; teamMap[name].value += l.dealValue || 0 }
    })
    res.json(Object.values(teamMap).sort((a, b) => b.value - a.value))
  } catch (err) { next(err) }
}
