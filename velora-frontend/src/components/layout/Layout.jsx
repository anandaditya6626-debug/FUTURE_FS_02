import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import CommandPalette from '../ui/CommandPalette'
import { useUIStore } from '../../store/uiStore'

export default function Layout() {
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {/* Ambient background orbs */}
          <div className="orb w-96 h-96 bg-velora-600/5 top-0 right-0 pointer-events-none" />
          <div className="orb w-64 h-64 bg-blue-600/5 bottom-20 left-10 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} />
    </div>
  )
}
