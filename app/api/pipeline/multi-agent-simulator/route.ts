import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { experiences } = body;

    if (!experiences || !Array.isArray(experiences)) {
      return NextResponse.json(
        { error: 'Experiences array is required' },
        { status: 400 }
      );
    }

    // Simulate conversation generation process
    const conversations: Conversation[] = [];

    for (let i = 0; i < experiences.length; i++) {
      const experience = experiences[i];

      // Simulate processing time for each conversation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const conversation: Conversation = {
        id: `conv_${Date.now()}_${i + 1}`,
        experience_id: experience.id,
        status: 'completed',
        task_success: Math.random() > 0.2, // 80% success rate
        turns: [
          {
            speaker: experience.personas[1].name, // Patient/Customer
            speaker_role: experience.personas[1].role,
            text: experience.conversation_starter,
            turn_id: 1,
            timestamp: new Date().toISOString()
          },
          {
            speaker: experience.personas[0].name, // Doctor/Agent
            speaker_role: experience.personas[0].role,
            text: `I understand your concern. Let me help you with your ${experience.task.replace('_', ' ')}. Can you provide more details?`,
            turn_id: 2,
            timestamp: new Date(Date.now() + 30000).toISOString()
          },
          {
            speaker: experience.personas[1].name,
            speaker_role: experience.personas[1].role,
            text: 'Thank you for helping. I\'ve been experiencing these symptoms for about 3 days now.',
            turn_id: 3,
            timestamp: new Date(Date.now() + 60000).toISOString()
          },
          {
            speaker: experience.personas[0].name,
            speaker_role: experience.personas[0].role,
            text: `Based on what you've described, I recommend ${experience.task === 'diagnose_fever' ? 'monitoring your temperature and getting tested' : 'processing your return request'}. ${experience.task === 'diagnose_fever' ? 'Please follow up if symptoms persist.' : 'You should receive your return label within 24 hours.'}`,
            turn_id: 4,
            timestamp: new Date(Date.now() + 90000).toISOString()
          }
        ],
        metadata: {
          total_turns: 4,
          duration_ms: 3000,
          tokens_used: Math.floor(Math.random() * 200) + 150
        }
      };

      conversations.push(conversation);
    }

    return NextResponse.json({
      success: true,
      conversations,
      metadata: {
        generated_at: new Date().toISOString(),
        processing_time_ms: experiences.length * 3000,
        num_conversations: conversations.length
      }
    });

  } catch (error) {
    console.error('Multi-agent simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate conversations' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Multi-Agent Simulator API',
    endpoints: {
      'POST /api/pipeline/multi-agent-simulator': 'Generate conversations from experiences'
    },
    features: [
      'LLM-powered agent conversations',
      'Real-time conversation generation',
      'Goal-oriented dialogue simulation',
      'Multi-turn conversation support'
    ]
  });
}
