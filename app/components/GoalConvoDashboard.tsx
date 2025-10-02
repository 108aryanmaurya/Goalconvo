'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Users, Filter, Database, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';
import ExperienceGenerator from './ExperienceGenerator';
import MultiAgentSimulator from './MultiAgentSimulator';
import PostProcessor from './PostProcessor';
import DatasetConstructor from './DatasetConstructor';
import Evaluator from './Evaluator';

interface PipelineStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  component: React.ReactNode;
}

export default function GoalConvoDashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineData, setPipelineData] = useState({
    experiences: [],
    conversations: [],
    filteredConversations: [],
    dataset: [],
    evaluations: {}
  });

  const steps: PipelineStep[] = [
    {
      id: 'experience',
      name: 'Experience Generation',
      description: 'Create structured blueprints with personas, situations, and goals',
      icon: <Brain className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: <ExperienceGenerator onComplete={(data) => handleStepComplete(0, data)} />
    },
    {
      id: 'simulation',
      name: 'Multi-Agent Simulation',
      description: 'Generate natural dialogues through LLM agent interactions',
      icon: <Users className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: <MultiAgentSimulator onComplete={(data) => handleStepComplete(1, data)} />
    },
    {
      id: 'postprocessing',
      name: 'Post-Processing',
      description: 'Filter, deduplicate, and ensure quality of generated dialogues',
      icon: <Filter className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: <PostProcessor onComplete={(data) => handleStepComplete(2, data)} />
    },
    {
      id: 'dataset',
      name: 'Dataset Construction',
      description: 'Compile high-quality dialogues into structured dataset',
      icon: <Database className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: <DatasetConstructor onComplete={(data) => handleStepComplete(3, data)} />
    },
    {
      id: 'evaluation',
      name: 'Evaluation',
      description: 'Assess quality, diversity, and downstream task performance',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'pending',
      progress: 0,
      component: <Evaluator onComplete={(data) => handleStepComplete(4, data)} />
    }
  ];

  const handleStepComplete = (stepIndex: number, data: any) => {
    const newPipelineData = { ...pipelineData };

    switch (stepIndex) {
      case 0:
        newPipelineData.experiences = data;
        break;
      case 1:
        newPipelineData.conversations = data;
        break;
      case 2:
        newPipelineData.filteredConversations = data;
        break;
      case 3:
        newPipelineData.dataset = data;
        break;
      case 4:
        newPipelineData.evaluations = data;
        break;
    }

    setPipelineData(newPipelineData);

    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const runPipeline = () => {
    setIsRunning(true);
    setCurrentStep(0);
  };

  const resetPipeline = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setPipelineData({
      experiences: [],
      conversations: [],
      filteredConversations: [],
      dataset: [],
      evaluations: {}
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pipeline Control</h2>
            <p className="text-gray-300">Manage the entire GoalConvo generation pipeline</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runPipeline}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-5 h-5" />
              {isRunning ? 'Running...' : 'Run Pipeline'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPipeline}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </motion.button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.5,
                scale: index === currentStep ? 1.05 : 1
              }}
              className={`p-3 rounded-xl border transition-all ${
                index === currentStep
                  ? 'border-cyan-400 bg-cyan-500/20'
                  : index < currentStep
                    ? 'border-green-400 bg-green-500/20'
                    : 'border-white/20 bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {step.icon}
                <span className="text-sm font-semibold text-white">{step.name}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  className={`h-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-green-400' : 'bg-cyan-400'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Current Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl">
              {steps[currentStep].icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {steps[currentStep].name}
              </h3>
              <p className="text-gray-300">{steps[currentStep].description}</p>
            </div>
          </div>

          {steps[currentStep].component}
        </motion.div>
      </AnimatePresence>

      {/* Pipeline Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-cyan-400 font-semibold mb-1">Experiences</div>
          <div className="text-2xl font-bold text-white">{pipelineData.experiences.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-purple-400 font-semibold mb-1">Conversations</div>
          <div className="text-2xl font-bold text-white">{pipelineData.conversations.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-pink-400 font-semibold mb-1">Filtered</div>
          <div className="text-2xl font-bold text-white">{pipelineData.filteredConversations.length}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-green-400 font-semibold mb-1">Dataset Size</div>
          <div className="text-2xl font-bold text-white">{pipelineData.dataset.length}</div>
        </div>
      </motion.div>
    </div>
  );
}
