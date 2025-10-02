import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversations } = body;

    if (!conversations || !Array.isArray(conversations)) {
      return NextResponse.json(
        { error: 'Conversations array is required' },
        { status: 400 }
      );
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2500));

    const filteredResults: FilteredConversation[] = conversations.map((conv: { id: string }, index: number) => {
      // Simulate quality assessment
      const baseScore = Math.random() * 0.3 + 0.7; // 70-100% range
      const isHighQuality = baseScore > 0.8;

      return {
        id: `filtered_${Date.now()}_${index + 1}`,
        original_id: conv.id,
        status: isHighQuality ? 'kept' : Math.random() > 0.5 ? 'modified' : 'removed',
        reason: isHighQuality
          ? 'High quality conversation with successful task completion'
          : Math.random() > 0.5
            ? 'Requires minor modifications for better coherence'
            : 'Does not meet quality thresholds',
        score: baseScore,
        metadata: {
          similarity_score: Math.random() * 0.4 + 0.1, // 10-50% similarity
          fluency_score: Math.random() * 0.2 + 0.8, // 80-100% fluency
          coherence_score: Math.random() * 0.15 + 0.85, // 85-100% coherence
          task_success_score: Math.random() * 0.2 + 0.8 // 80-100% task success
        }
      };
    });

    const stats = {
      total: conversations.length,
      kept: filteredResults.filter(r => r.status === 'kept').length,
      modified: filteredResults.filter(r => r.status === 'modified').length,
      removed: filteredResults.filter(r => r.status === 'removed').length
    };

    return NextResponse.json({
      success: true,
      filtered_conversations: filteredResults,
      statistics: stats,
      metadata: {
        processed_at: new Date().toISOString(),
        processing_time_ms: 2500,
        filters_applied: [
          'duplicate_detection',
          'quality_threshold',
          'coherence_check',
          'task_success_verification'
        ]
      }
    });

  } catch (error) {
    console.error('Post-processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process conversations' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Post-Processor API',
    endpoints: {
      'POST /api/pipeline/post-processor': 'Filter and quality-check conversations'
    },
    filters: [
      'Duplicate Detection (semantic similarity)',
      'Quality Threshold (fluency, coherence)',
      'Task Success Verification',
      'Length and Structure Validation'
    ],
    output: {
      kept: 'High-quality conversations that pass all filters',
      modified: 'Conversations that need minor improvements',
      removed: 'Conversations that fail quality checks'
    }
  });
}
