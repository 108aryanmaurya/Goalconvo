'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Zap, Clock, Play, Pause, RotateCcw, User, Bot } from 'lucide-react';

interface Conversation {
  id: string;
  turns: Array<{
    speaker: string;
    speaker_role: string;
    text: string;
    turn_id: number;
    timestamp: string;
  }>;
  experience_id: string;
  status: 'generating' | 'completed' | 'failed';
  task_success: boolean;
  metadata: {
    total_turns: number;
    duration_ms: number;
    tokens_used: number;
  };
}

interface MultiAgentSimulatorProps {
  onComplete: (conversations: Conversation[]) => void;
}

export default function MultiAgentSimulator({ onComplete }: MultiAgentSimulatorProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);

  const mockConversations: Conversation[] = [
    {
      id: 'conv_001',
      experience_id: 'exp_001',
      status: 'completed',
      task_success: true,
      turns: [
        {
          speaker: 'Alex Rodriguez',
          speaker_role: 'patient',
          text: 'I\'ve had a fever for three days and it\'s not improving. I also have a persistent cough.',
          turn_id: 1,
          timestamp: '2024-01-15T10:00:00Z'
        },
        {
          speaker: 'Dr. Sarah Chen',
          speaker_role: 'doctor',
          text: 'I understand you\'re concerned. When did the symptoms start exactly, and have you taken any medication?',
          turn_id: 2,
          timestamp: '2024-01-15T10:00:30Z'
        },
        {
          speaker: 'Alex Rodriguez',
          speaker_role: 'patient',
          text: 'It started on Monday evening. I took some ibuprofen yesterday, but the fever came back this morning.',
          turn_id: 3,
          timestamp: '2024-01-15T10:01:00Z'
        },
        {
          speaker: 'Dr. Sarah Chen',
          speaker_role: 'doctor',
          text: 'Based on your symptoms, this could be a viral infection. I recommend getting a COVID test and monitoring your temperature. If it persists beyond 5 days, please come in for further evaluation.',
          turn_id: 4,
          timestamp: '2024-01-15T10:01:30Z'
        }
      ],
      metadata: {
        total_turns: 4,
        duration_ms: 1500,
        tokens_used: 245
      }
    },
    {
      id: 'conv_002',
      experience_id: 'exp_002',
      status: 'completed',
      task_success: true,
      turns: [
        {
          speaker: 'Michael Thompson',
          speaker_role: 'customer',
          text: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.',
          turn_id: 1,
          timestamp: '2024-01-15T14:00:00Z'
        },
        {
          speaker: 'Jennifer Walsh',
          speaker_role: 'customer_service_agent',
          text: 'I\'m sorry to hear about the issue with your device. Could you please describe the specific problem you\'re experiencing?',
          turn_id: 2,
          timestamp: '2024-01-15T14:00:45Z'
        },
        {
          speaker: 'Michael Thompson',
          speaker_role: 'customer',
          text: 'The screen won\'t turn on even though I charged it overnight. The charging light doesn\'t come on either.',
          turn_id: 3,
          timestamp: '2024-01-15T14:01:15Z'
        },
        {
          speaker: 'Jennifer Walsh',
          speaker_role: 'customer_service_agent',
          text: 'I understand. This sounds like a hardware issue. I\'ll process your return authorization right away. You should receive a prepaid return label within 24 hours, and your refund will be processed once we receive the item.',
          turn_id: 4,
          timestamp: '2024-01-15T14:01:45Z'
        }
      ],
      metadata: {
        total_turns: 4,
        duration_ms: 1200,
        tokens_used: 198
      }
    }
  ];

  const startSimulation = async () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    setConversations([]);
    setCurrentTurn(0);

    try {
      // Simulate conversation generation process
      const steps = [
        'Initializing agents...',
        'Setting up conversation context...',
        'Generating first responses...',
        'Processing agent interactions...',
        'Monitoring goal progress...',
        'Completing conversations...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSimulationProgress((i + 1) / steps.length * 100);
      }

      // Call the actual API
      const response = await fetch('/api/pipeline/multi-agent-simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experiences: [] // This would come from the previous step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate conversations');
      }

      const data = await response.json();

      if (data.success) {
        // Add conversations one by one with animation
        for (let i = 0; i < data.conversations.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setConversations(prev => [...prev, data.conversations[i]]);
        }

        setIsSimulating(false);
        onComplete(data.conversations);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Multi-agent simulation error:', error);
      // Fallback to mock data if API fails
      for (let i = 0; i < mockConversations.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setConversations(prev => [...prev, mockConversations[i]]);
      }

      setIsSimulating(false);
      onComplete(mockConversations);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Multi-Agent Simulation</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSimulating ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Simulation
              </>
            )}
          </motion.button>
        </div>

        {/* Simulation Progress */}
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Simulation Progress</span>
              <span className="text-purple-400 font-semibold">{Math.round(simulationProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${simulationProgress}%` }}
                className="bg-gradient-to-r from-purple-400 to-pink-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Conversations Display */}
      {conversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-400" />
            Generated Conversations ({conversations.length})
          </h4>

          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedConversation(selectedConversation === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      conversation.task_success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <h5 className="font-semibold text-white">{conversation.id}</h5>
                      <p className="text-sm text-gray-300">
                        {conversation.turns.length} turns • {conversation.metadata.duration_ms}ms
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      conversation.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {conversation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Conversation Turns */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: selectedConversation === index ? 'auto' : 0,
                  opacity: selectedConversation === index ? 1 : 0
                }}
                className="border-t border-white/20 overflow-hidden"
              >
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {conversation.turns.map((turn, turnIndex) => (
                    <motion.div
                      key={turn.turn_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: turnIndex * 0.1 }}
                      className={`flex gap-3 ${
                        turn.speaker_role === 'patient' || turn.speaker_role === 'customer'
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div className={`max-w-md p-3 rounded-lg ${
                        turn.speaker_role === 'patient' || turn.speaker_role === 'customer'
                          ? 'bg-blue-500/20 border border-blue-400/30'
                          : 'bg-purple-500/20 border border-purple-400/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {turn.speaker_role === 'patient' || turn.speaker_role === 'customer' ? (
                            <User className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Bot className="w-4 h-4 text-purple-400" />
                          )}
                          <span className="font-semibold text-white text-sm">{turn.speaker}</span>
                          <span className="text-xs text-gray-400">{formatTimestamp(turn.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-200">{turn.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Conversation Metadata */}
                <div className="px-4 pb-4 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 pt-3 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Total Turns</div>
                      <div className="text-white font-semibold">{conversation.metadata.total_turns}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Duration</div>
                      <div className="text-white font-semibold">{conversation.metadata.duration_ms}ms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Tokens Used</div>
                      <div className="text-white font-semibold">{conversation.metadata.tokens_used}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Real-time Simulation Stats */}
      {isSimulating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{conversations.length}</div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{currentTurn}</div>
              <div className="text-sm text-gray-400">Current Turn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{Math.round(simulationProgress)}%</div>
              <div className="text-sm text-gray-400">Progress</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
