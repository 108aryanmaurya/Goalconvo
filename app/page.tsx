'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import GoalConvoDashboard from './components/GoalConvoDashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, #9C92AC 2px, transparent 2px),
                         radial-gradient(circle at 75% 75%, #9C92AC 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}></div>

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-8 px-4"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            GoalConvo
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Multi-Agent LLM System for Generating Task-Oriented Dialogues
          </motion.p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="px-4 pb-8"
        >
          <GoalConvoDashboard />
        </motion.div>
      </div>
    </div>
  );
}
