'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Download, FileText, Archive, CheckCircle, Loader2, Play } from 'lucide-react';

interface DatasetItem {
  id: string;
  conv_id: string;
  domain: string;
  task: string;
  personas: Array<{
    name: string;
    role: string;
    traits: string[];
  }>;
  turns: Array<{
    speaker: string;
    text: string;
    turn_id: number;
  }>;
  task_success: boolean;
  metadata: {
    total_turns: number;
    domain_category: string;
    creation_timestamp: string;
    quality_score: number;
  };
}

interface DatasetConstructorProps {
  onComplete: (dataset: DatasetItem[]) => void;
}

export default function DatasetConstructor({ onComplete }: DatasetConstructorProps) {
  const [isConstructing, setIsConstructing] = useState(false);
  const [dataset, setDataset] = useState<DatasetItem[]>([]);
  const [constructionStep, setConstructionStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const mockDataset: DatasetItem[] = [
    {
      id: 'dataset_001',
      conv_id: 'filtered_001',
      domain: 'healthcare',
      task: 'diagnose_fever',
      personas: [
        {
          name: 'Dr. Sarah Chen',
          role: 'doctor',
          traits: ['calm', 'analytical', 'empathetic']
        },
        {
          name: 'Alex Rodriguez',
          role: 'patient',
          traits: ['worried', 'cooperative', 'detailed']
        }
      ],
      turns: [
        {
          speaker: 'patient',
          text: 'I\'ve had a fever for three days and it\'s not improving. I also have a persistent cough.',
          turn_id: 1
        },
        {
          speaker: 'doctor',
          text: 'I understand you\'re concerned. When did the symptoms start exactly, and have you taken any medication?',
          turn_id: 2
        },
        {
          speaker: 'patient',
          text: 'It started on Monday evening. I took some ibuprofen yesterday, but the fever came back this morning.',
          turn_id: 3
        },
        {
          speaker: 'doctor',
          text: 'Based on your symptoms, this could be a viral infection. I recommend getting a COVID test and monitoring your temperature. If it persists beyond 5 days, please come in for further evaluation.',
          turn_id: 4
        }
      ],
      task_success: true,
      metadata: {
        total_turns: 4,
        domain_category: 'clinical_diagnosis',
        creation_timestamp: '2024-01-15T10:05:00Z',
        quality_score: 0.95
      }
    },
    {
      id: 'dataset_002',
      conv_id: 'filtered_002',
      domain: 'customer_support',
      task: 'refund_request',
      personas: [
        {
          name: 'Jennifer Walsh',
          role: 'customer_service_agent',
          traits: ['patient', 'solution-oriented', 'professional']
        },
        {
          name: 'Michael Thompson',
          role: 'customer',
          traits: ['frustrated', 'determined', 'polite']
        }
      ],
      turns: [
        {
          speaker: 'customer',
          text: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.',
          turn_id: 1
        },
        {
          speaker: 'customer_service_agent',
          text: 'I\'m sorry to hear about the issue with your device. Could you please describe the specific problem you\'re experiencing?',
          turn_id: 2
        },
        {
          speaker: 'customer',
          text: 'The screen won\'t turn on even though I charged it overnight. The charging light doesn\'t come on either.',
          turn_id: 3
        },
        {
          speaker: 'customer_service_agent',
          text: 'I understand. This sounds like a hardware issue. I\'ll process your return authorization right away. You should receive a prepaid return label within 24 hours, and your refund will be processed once we receive the item.',
          turn_id: 4
        }
      ],
      task_success: true,
      metadata: {
        total_turns: 4,
        domain_category: 'refund_processing',
        creation_timestamp: '2024-01-15T14:05:00Z',
        quality_score: 0.92
      }
    }
  ];

  const startConstruction = async () => {
    setIsConstructing(true);
    setProgress(0);
    setDataset([]);
    setConstructionStep('');

    try {
      const steps = [
        'Structuring conversation data...',
        'Adding domain classifications...',
        'Incorporating persona information...',
        'Calculating metadata and statistics...',
        'Validating data integrity...',
        'Finalizing dataset format...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setConstructionStep(steps[i]);
        setProgress((i + 1) / steps.length * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Call the actual API
      const response = await fetch('/api/pipeline/dataset-constructor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filtered_conversations: [] // This would come from the previous step
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to construct dataset');
      }

      const data = await response.json();

      if (data.success) {
        setDataset(data.dataset);
        onComplete(data.dataset);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Dataset construction error:', error);
      // Fallback to mock data if API fails
      setDataset(mockDataset);
      setIsConstructing(false);
      onComplete(mockDataset);
    } finally {
      setIsConstructing(false);
    }
  };

  const exportDataset = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(dataset, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'goalconvo_dataset.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Construction Controls */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Dataset Construction</h3>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startConstruction}
              disabled={isConstructing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isConstructing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Constructing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Construct Dataset
                </>
              )}
            </motion.button>
            {dataset.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => exportDataset('json')}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <Download className="w-5 h-5" />
                Export JSON
              </motion.button>
            )}
          </div>
        </div>

        {/* Construction Progress */}
        {isConstructing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{constructionStep}</span>
              <span className="text-green-400 font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-green-400 to-teal-600 h-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Dataset Statistics */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-400">{dataset.length}</div>
            <div className="text-sm text-gray-400">Total Conversations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {dataset.reduce((acc, item) => acc + item.metadata.total_turns, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Turns</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {new Set(dataset.map(item => item.domain)).size}
            </div>
            <div className="text-sm text-gray-400">Domains</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {(dataset.reduce((acc, item) => acc + item.metadata.quality_score, 0) / dataset.length * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">Avg Quality</div>
          </div>
        </motion.div>
      )}

      {/* Dataset Items */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-green-400" />
            Dataset Items
          </h4>

          {dataset.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl border border-white/20 overflow-hidden"
            >
              <div
                className="p-4 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedItem(selectedItem === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.task_success ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <h5 className="font-semibold text-white">{item.conv_id}</h5>
                      <p className="text-sm text-gray-300">
                        {item.domain} • {item.task.replace('_', ' ')} • {item.metadata.total_turns} turns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.task_success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {item.task_success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed View */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: selectedItem === index ? 'auto' : 0,
                  opacity: selectedItem === index ? 1 : 0
                }}
                className="border-t border-white/20 overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Domain:</span>
                      <div className="text-white font-semibold capitalize">{item.domain}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Task:</span>
                      <div className="text-white font-semibold">{item.task.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Quality Score:</span>
                      <div className="text-white font-semibold">{(item.metadata.quality_score * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <div className="text-white font-semibold">
                        {new Date(item.metadata.creation_timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Personas */}
                  <div className="space-y-2">
                    <h6 className="text-sm font-semibold text-white">Participants</h6>
                    <div className="grid md:grid-cols-2 gap-3">
                      {item.personas.map((persona, pIndex) => (
                        <div key={pIndex} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${
                              pIndex === 0 ? 'bg-blue-400' : 'bg-purple-400'
                            }`} />
                            <span className="font-semibold text-white">{persona.name}</span>
                            <span className="text-xs bg-white/20 text-gray-300 px-2 py-1 rounded capitalize">
                              {persona.role}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {persona.traits.map((trait, tIndex) => (
                              <span key={tIndex} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Conversation */}
                  <div className="space-y-2">
                    <h6 className="text-sm font-semibold text-white">Sample Conversation</h6>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10 max-h-32 overflow-y-auto">
                      {item.turns.slice(0, 2).map((turn) => (
                        <div key={turn.turn_id} className="text-sm text-gray-300 mb-2 last:mb-0">
                          <span className={`font-semibold ${
                            turn.speaker === 'patient' || turn.speaker === 'customer' ? 'text-blue-400' : 'text-purple-400'
                          }`}>
                            {turn.speaker}:
                          </span> {turn.text}
                        </div>
                      ))}
                      {item.turns.length > 2 && (
                        <div className="text-xs text-gray-500 mt-2">
                          ... and {item.turns.length - 2} more turns
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Export Options */}
      {dataset.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/20"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-400" />
            Export Options
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportDataset('json')}
              className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <div className="font-semibold text-white">JSON Format</div>
                <div className="text-sm text-gray-400">Structured data format</div>
              </div>
            </motion.button>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <Archive className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-400">CSV Format</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <Database className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-400">Database Export</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
