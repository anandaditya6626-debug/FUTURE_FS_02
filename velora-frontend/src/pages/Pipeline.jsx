import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react'
import { formatCurrency, getInitials, generateColor, STATUS_CONFIG } from '../lib/utils'
import { cn } from '../lib/utils'

const STAGES = [
  { id: 'New',         label: 'New',         color: '#3b82f6', bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  { id: 'Qualified',   label: 'Qualified',   color: '#8b5cf6', bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  { id: 'Proposal',    label: 'Proposal',    color: '#f59e0b', bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
  { id: 'Negotiation', label: 'Negotiation', color: '#f97316', bg: 'bg-orange-500/10',  border: 'border-orange-500/20' },
  { id: 'Won',         label: 'Won',         color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 'Lost',        label: 'Lost',        color: '#ef4444', bg: 'bg-red-500/10',     border: 'border-red-500/20' },
]

const INIT_CARDS = {
  New:         [{ id:'1', name:'Priya Sharma',  value:450000,  score:85, company:'TechStartup' },
                { id:'7', name:'Meera Iyer',    value:560000,  score:77, company:'HealthTech' }],
  Qualified:   [{ id:'2', name:'Arjun Mehta',   value:280000,  score:72, company:'DesignCo' },
                { id:'8', name:'Suresh Patel',  value:890000,  score:61, company:'Manufact' }],
  Proposal:    [{ id:'3', name:'Kavita Nair',   value:1200000, score:91, company:'RetailBrand' },
                { id:'10',name:'Kiran Reddy',   value:2500000, score:83, company:'RealEstate' }],
  Negotiation: [{ id:'4', name:'Rohit Verma',   value:750000,  score:68, company:'FinTech' }],
  Won:         [{ id:'5', name:'Anjali Singh',  value:320000,  score:94, company:'EcomCo' }],
  Lost:        [{ id:'6', name:'Vikram Bose',   value:180000,  score:34, company:'Logistix' }],
}

function KanbanCard({ card, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes}
      className="kanban-card group bg-dark-800/60 border border-white/[0.08] rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-velora-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0', generateColor(card.name))}>
            {getInitials(card.name)}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">{card.name}</p>
            <p className="text-[10px] text-dark-400">{card.company}</p>
          </div>
        </div>
        <div {...listeners} className="opacity-0 group-hover:opacity-100 cursor-grab text-dark-600 hover:text-dark-400 transition-opacity mt-0.5">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white">{formatCurrency(card.value)}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-1 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-velora-500" style={{ width: `${card.score}%` }} />
          </div>
          <span className="text-[10px] text-dark-400">{card.score}</span>
        </div>
      </div>
    </div>
  )
}

export default function Pipeline() {
  const [columns, setColumns] = useState(INIT_CARDS)
  const [activeCard, setActiveCard] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const findColumn = (id) => Object.keys(columns).find((col) => columns[col].some((c) => c.id === id))

  const handleDragStart = ({ active }) => {
    const col = findColumn(active.id)
    if (col) setActiveCard(columns[col].find((c) => c.id === active.id))
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null)
    if (!over) return
    const fromCol = findColumn(active.id)
    const toCol   = STAGES.find((s) => s.id === over.id) ? over.id : findColumn(over.id)
    if (!fromCol || !toCol) return

    if (fromCol === toCol) {
      const items   = columns[fromCol]
      const oldIdx  = items.findIndex((c) => c.id === active.id)
      const newIdx  = items.findIndex((c) => c.id === over.id)
      if (oldIdx !== newIdx) setColumns({ ...columns, [fromCol]: arrayMove(items, oldIdx, newIdx) })
    } else {
      const card    = columns[fromCol].find((c) => c.id === active.id)
      setColumns({
        ...columns,
        [fromCol]: columns[fromCol].filter((c) => c.id !== active.id),
        [toCol]:   [...columns[toCol], card],
      })
    }
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Pipeline</h2>
          <p className="text-xs text-dark-400 mt-0.5">Drag cards between stages to update status</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-dark-400">
          <span>Total: <span className="text-white font-semibold">{formatCurrency(Object.values(columns).flat().reduce((s,c)=>s+c.value,0))}</span></span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {STAGES.map((stage) => {
            const cards     = columns[stage.id] || []
            const stageVal  = cards.reduce((s, c) => s + c.value, 0)
            return (
              <div key={stage.id} className={cn('flex-shrink-0 w-64 glass rounded-2xl overflow-hidden border', stage.border)}>
                <div className={cn('px-4 py-3 border-b', stage.bg)} style={{ borderBottomColor: `${stage.color}20` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                      <span className="text-sm font-semibold text-white">{stage.label}</span>
                      <span className="w-5 h-5 rounded-full bg-dark-700 text-dark-300 text-[10px] font-bold flex items-center justify-center">{cards.length}</span>
                    </div>
                    <button className="text-dark-500 hover:text-white transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <p className="text-[11px] text-dark-400 mt-1">{formatCurrency(stageVal)}</p>
                </div>
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy} id={stage.id}>
                  <div className="p-3 space-y-2.5 min-h-[200px]">
                    {cards.map((card) => (
                      <KanbanCard key={card.id} card={card} isDragging={activeCard?.id === card.id} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )
          })}
        </div>
        <DragOverlay>
          {activeCard && (
            <div className="kanban-card bg-dark-800/95 border border-velora-500/40 rounded-xl p-3.5 w-64 shadow-neon-purple rotate-2">
              <p className="text-xs font-semibold text-white">{activeCard.name}</p>
              <p className="text-[11px] text-dark-400">{formatCurrency(activeCard.value)}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
