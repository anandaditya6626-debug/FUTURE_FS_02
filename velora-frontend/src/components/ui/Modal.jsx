import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '../../lib/utils'

export default function Modal({ open, onClose, title, subtitle, children, size = 'md', className }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  }[size]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={cn('glass rounded-2xl w-full border border-white/10 shadow-glass overflow-hidden', sizeClass, className)}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || subtitle) && (
                <div className="flex items-start justify-between px-6 py-4 border-b border-white/[0.06]">
                  <div>
                    {title    && <h2 className="font-display font-semibold text-white text-base">{title}</h2>}
                    {subtitle && <p className="text-xs text-dark-400 mt-0.5">{subtitle}</p>}
                  </div>
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-dark-400 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
