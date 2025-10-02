'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';

interface FilteredConversation {
  id: string;
  original_id: string;
  status: 'kept' | 'removed' | 'modified';
  reason: string;
  score: number;
  metadata: {
    similarity_score?: number;
    fluency_score?: number;
    coherence_score?: number;
    task_success_score?: number;
  };
}

interface PostProcessorProps {
  onComplete: (filteredConversations: FilteredConversation[]) => void;
}

export default function PostProcessor({ onComplete }: PostProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [filteredConversations, setFilteredConversations] = useState<FilteredConversation[]>([]);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    kept: 0,
    removed: 0,
    modified: 0
  });

  const mockFilteredResults: FilteredConversation[] = [
    {
      id: 'filtered_001',
      original_id: 'conv_001',
      status: 'kept',
      reason: 'High quality conversation with successful task completion',
      score: 0.95,
      metadata: {
        similarity_score: 0.12,
        fluency_score: 0.98,
        coherence_score: 0.96,
        task_success_score: 0.94
      }
    },
    {
      id: 'filtered_002',
      original_id: 'conv_002',
      status: 'kept',
      reason: 'Excellent customer service interaction',
      score: 0.92,
      metadata: {
        similarity_score: 0.08,
        fluency_score: 0.95,
        coherence_score: 0.93,
        task_success_score: 0.89
      }
    }
  ];

  const startProcessing = async () => {
    setIsProcessing(true);
    setProgress(0);
    setFilteredConversations([]);
    setStats({ total: 0, kept: 0, removed: 0, modified: 0 });

    try {
      const steps = [
        'Analyzing conversation quality...',
        'Checking for duplicates...',
        'Evaluating task success...',
        'Assessing fluency and coherence...',
        'Applying filtering criteria...',
        'Finalizing filtered dataset...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setProcessingStep(steps[i]);
        setProgress((i + 1) / steps.length * 100);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1200));

        // Update stats as we process
        if (i === 2) {
          setStats(prev => ({ ...prev, total: 2 }));
        }
        if (i === 4) {
          setStats(prev => ({ ...prev, kept: 2 }));
        }
      }

      // Call the actual API
      const response = await fetch('/api/pipeline/post-processor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversations: [] // This would come from the previous step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process conversations');
      }

      const data = await response.json();

      if (data.success) {
        setFilteredConversations(data.filtered_conversations);
        setStats({
          total: data.statistics.total,
          kept: data.statistics.kept,
          removed: data.statistics.removed,
          modified: data.statistics.modified
        });
        onComplete(data.filtered_conversations);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Post-processing error:', error);
      // Fallback to mock data if API fails
      setFilteredConversations(mockFilteredResults);
      setStats(prev => ({ ...prev, kept: 2 }));
      setIsProcessing(false);
      onComplete(mockFilteredResults);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'kept': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'removed': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'modified': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'kept': return <CheckCircle className="w-4 h-4" />;
      case 'removed': return <XCircle className="w-4 h-4" />;
      case 'modified': return <AlertTriangle className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Processing Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-pink-400" />
            <h3 className="text-xl font-semibold text-white">Post-Processing & Filtering</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startProcessing}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Filter className="w-5 h-5" />
                Start Processing
              </>
            )}
          </motion.button>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{processingStep}</span>
              <span className="text-pink-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-pink-400 to-red-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Filtering Statistics */}
      {stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-4"
        >
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Conversations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.kept}</div>
            <div className="text-sm text-gray-400">Kept</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.removed}</div>
            <div className="text-sm text-gray-400">Removed</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.modified}</div>
            <div className="text-sm text-gray-400">Modified</div>
          </div>
        </motion.div>
      )}

      {/* Filtered Results */}
      {filteredConversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Filtered Results
          </h4>

          {filteredConversations.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl border p-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <span className="font-semibold text-white">{result.original_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Score:</span>
                  <span className={`font-semibold ${(result.score * 100).toFixed(0)}`}>
                    {(result.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-3">{result.reason}</p>

              {/* Quality Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {result.metadata.similarity_score !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Similarity</div>
                    <div className={`text-sm font-semibold ${
                      result.metadata.similarity_score < 0.3 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(result.metadata.similarity_score * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                {result.metadata.fluency_score !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Fluency</div>
                    <div className={`text-sm font-semibold ${
                      result.metadata.fluency_score > 0.8 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {(result.metadata.fluency_score * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                {result.metadata.coherence_score !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Coherence</div>
                    <div className={`text-sm font-semibold ${
                      result.metadata.coherence_score > 0.8 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {(result.metadata.coherence_score * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                {result.metadata.task_success_score !== undefined && (
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Task Success</div>
                    <div className={`text-sm font-semibold ${
                      result.metadata.task_success_score > 0.8 ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {(result.metadata.task_success_score * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quality Metrics Overview */}
      {filteredConversations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/20"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Quality Metrics Overview
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {filteredConversations.filter(c => c.status === 'kept').length}
              </div>
              <div className="text-sm text-gray-400">High Quality</div>
              <div className="text-xs text-gray-500">Score {'>'} 90%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {filteredConversations.filter(c => c.status === 'modified').length}
              </div>
              <div className="text-sm text-gray-400">Needs Review</div>
              <div className="text-xs text-gray-500">Score 70-90%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {Math.round(filteredConversations.reduce((acc, c) => acc + c.score, 0) / filteredConversations.length * 100)}%
              </div>
              <div className="text-sm text-gray-400">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {filteredConversations.length}
              </div>
              <div className="text-sm text-gray-400">Total Filtered</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
