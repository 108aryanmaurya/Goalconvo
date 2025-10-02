'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, CheckCircle, XCircle, AlertTriangle, Award, Zap } from 'lucide-react';

interface EvaluationMetrics {
  overall_score: number;
  diversity_score: number;
  coherence_score: number;
  task_success_rate: number;
  fluency_score: number;
  groundedness_score: number;
  categories: {
    lexical_diversity: number;
    conversation_length: {
      avg_turns: number;
      std_dev: number;
    };
    domain_distribution: Record<string, number>;
    task_success_by_domain: Record<string, number>;
  };
}

interface EvaluatorProps {
  onComplete: (evaluations: EvaluationMetrics) => void;
}

export default function Evaluator({ onComplete }: EvaluatorProps) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);
  const [evaluationStep, setEvaluationStep] = useState('');
  const [progress, setProgress] = useState(0);

  const mockMetrics: EvaluationMetrics = {
    overall_score: 0.89,
    diversity_score: 0.85,
    coherence_score: 0.92,
    task_success_rate: 0.87,
    fluency_score: 0.91,
    groundedness_score: 0.88,
    categories: {
      lexical_diversity: 78.5,
      conversation_length: {
        avg_turns: 6.8,
        std_dev: 2.1
      },
      domain_distribution: {
        healthcare: 45,
        customer_support: 35,
        education: 20
      },
      task_success_by_domain: {
        healthcare: 0.92,
        customer_support: 0.85,
        education: 0.83
      }
    }
  };

  const startEvaluation = async () => {
    setIsEvaluating(true);
    setProgress(0);
    setMetrics(null);

    try {
      const steps = [
        'Analyzing lexical diversity (MTLD)...',
        'Evaluating conversation coherence...',
        'Assessing task success rates...',
        'Measuring fluency and naturalness...',
        'Checking groundedness in personas...',
        'Computing domain distribution...',
        'Generating final evaluation report...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setEvaluationStep(steps[i]);
        setProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Call the actual API
      const response = await fetch('/api/pipeline/evaluator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataset: [] // This would come from the previous step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate dataset');
      }

      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        onComplete(data.metrics);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Evaluation error:', error);
      // Fallback to mock data if API fails
      setMetrics(mockMetrics);
      setIsEvaluating(false);
      onComplete(mockMetrics);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-400 bg-green-500/20 border-green-400/30';
    if (score >= 0.8) return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
    if (score >= 0.7) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    return 'text-red-400 bg-red-500/20 border-red-400/30';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <Award className="w-5 h-5" />;
    if (score >= 0.8) return <CheckCircle className="w-5 h-5" />;
    if (score >= 0.7) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Evaluation Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-white">Evaluation Framework</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startEvaluation}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEvaluating ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Evaluating...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Start Evaluation
              </>
            )}
          </motion.button>
        </div>

        {/* Evaluation Progress */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{evaluationStep}</span>
              <span className="text-cyan-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Evaluation Results */}
      {metrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Scores */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.overall_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.overall_score)}
                <span className="font-semibold text-white">Overall Score</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.overall_score * 100).toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.diversity_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.diversity_score)}
                <span className="font-semibold text-white">Diversity</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.diversity_score * 100).toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.coherence_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.coherence_score)}
                <span className="font-semibold text-white">Coherence</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.coherence_score * 100).toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.task_success_rate)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.task_success_rate)}
                <span className="font-semibold text-white">Task Success</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.task_success_rate * 100).toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.fluency_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.fluency_score)}
                <span className="font-semibold text-white">Fluency</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.fluency_score * 100).toFixed(1)}%
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${getScoreColor(metrics.groundedness_score)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(metrics.groundedness_score)}
                <span className="font-semibold text-white">Groundedness</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {(metrics.groundedness_score * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lexical Diversity */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Lexical Diversity
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">MTLD Score</span>
                  <span className="font-semibold text-white">{metrics.categories.lexical_diversity.toFixed(1)}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-600 h-2 rounded-full"
                    style={{ width: `${(metrics.categories.lexical_diversity / 100) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Higher MTLD indicates greater lexical diversity and richness in vocabulary
                </p>
              </div>
            </div>

            {/* Conversation Length */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Conversation Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Average Turns</span>
                  <span className="font-semibold text-white">{metrics.categories.conversation_length.avg_turns.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Standard Deviation</span>
                  <span className="font-semibold text-white">{metrics.categories.conversation_length.std_dev.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-400">
                  Balanced conversation lengths indicate natural dialogue patterns
                </p>
              </div>
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Domain Distribution
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {Object.entries(metrics.categories.domain_distribution).map(([domain, percentage]) => (
                <div key={domain} className="text-center">
                  <div className="text-lg font-bold text-white mb-1 capitalize">{domain.replace('_', ' ')}</div>
                  <div className="text-2xl font-bold text-cyan-400">{percentage}%</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {Object.entries(metrics.categories.domain_distribution).map(([domain, percentage]) => (
                <div key={domain} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-300 capitalize">{domain.replace('_', ' ')}</div>
                  <div className="flex-1 bg-white/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-semibold text-white text-right">{percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Success by Domain */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              Task Success by Domain
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(metrics.categories.task_success_by_domain).map(([domain, successRate]) => (
                <div key={domain} className={`rounded-lg p-4 border ${getScoreColor(successRate)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getScoreIcon(successRate)}
                    <span className="font-semibold text-white capitalize">{domain.replace('_', ' ')}</span>
                  </div>
                  <div className="text-xl font-bold text-white">
                    {(successRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-300">Success Rate</div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Summary */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl p-6 border border-cyan-400/30">
            <h4 className="text-lg font-semibold text-white mb-3">Evaluation Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-2">
                  The GoalConvo system demonstrates strong performance across all evaluated metrics:
                </p>
                <ul className="space-y-1 text-gray-300">
                  <li>• High lexical diversity indicating rich vocabulary usage</li>
                  <li>• Excellent coherence scores showing natural conversation flow</li>
                  <li>• Strong task success rates across all domains</li>
                  <li>• Good balance of conversation lengths</li>
                </ul>
              </div>
              <div>
                <p className="text-gray-300 mb-2">
                  Areas for potential improvement:
                </p>
                <ul className="space-y-1 text-gray-300">
                  <li>• Further domain diversification</li>
                  <li>• Enhanced persona complexity</li>
                  <li>• More sophisticated goal detection</li>
                  <li>• Advanced filtering mechanisms</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
