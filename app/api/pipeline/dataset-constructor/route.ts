import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filtered_conversations } = body;

    if (!filtered_conversations || !Array.isArray(filtered_conversations)) {
      return NextResponse.json(
        { error: 'Filtered conversations array is required' },
        { status: 400 }
      );
    }

    // Simulate dataset construction time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const dataset: DatasetItem[] = filtered_conversations
      .filter((conv: { status: string }) => conv.status === 'kept' || conv.status === 'modified')
      .map((filteredConv: { original_id: string; score: number }, index: number) => {
        // Mock conversation data based on filtered conversation
        const mockConversation = {
          domain: 'healthcare', // This would come from the original conversation data
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
          task_success: filteredConv.score > 0.8,
          metadata: {
            total_turns: 4,
            domain_category: 'clinical_diagnosis',
            creation_timestamp: new Date().toISOString(),
            quality_score: filteredConv.score
          }
        };

        return {
          id: `dataset_${Date.now()}_${index + 1}`,
          conv_id: filteredConv.original_id,
          ...mockConversation
        };
      });

    const statistics = {
      total_conversations: dataset.length,
      total_turns: dataset.reduce((acc, item) => acc + item.metadata.total_turns, 0),
      domains: [...new Set(dataset.map(item => item.domain))],
      avg_quality_score: dataset.reduce((acc, item) => acc + item.metadata.quality_score, 0) / dataset.length,
      task_success_rate: dataset.filter(item => item.task_success).length / dataset.length
    };

    return NextResponse.json({
      success: true,
      dataset,
      statistics,
      metadata: {
        constructed_at: new Date().toISOString(),
        processing_time_ms: 2000,
        format_version: '1.0',
        export_formats: ['json', 'csv', 'huggingface']
      }
    });

  } catch (error) {
    console.error('Dataset construction error:', error);
    return NextResponse.json(
      { error: 'Failed to construct dataset' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Dataset Constructor API',
    endpoints: {
      'POST /api/pipeline/dataset-constructor': 'Construct structured dataset from filtered conversations'
    },
    output_format: {
      id: 'Unique dataset item identifier',
      conv_id: 'Reference to original conversation',
      domain: 'Conversation domain (healthcare, customer_support, etc.)',
      task: 'Specific task within domain',
      personas: 'Array of participant personas',
      turns: 'Array of conversation turns with speaker and text',
      task_success: 'Boolean indicating if task was completed successfully',
      metadata: 'Additional metrics and timestamps'
    },
    features: [
      'Structured JSON format',
      'Quality score integration',
      'Domain categorization',
      'Export in multiple formats'
    ]
  });
}
