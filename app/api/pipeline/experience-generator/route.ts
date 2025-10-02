import { NextRequest, NextResponse } from 'next/server';

interface Experience {
  id: string;
  domain: string;
  task: string;
  personas: Array<{
    name: string;
    role: string;
    traits: string[];
    background: string;
  }>;
  situation: string;
  goal: string;
  conversation_starter: string;
  constraints: {
    max_turns: number;
    response_style: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, task, num_experiences = 2 } = body;

    if (!domain || !task) {
      return NextResponse.json(
        { error: 'Domain and task are required' },
        { status: 400 }
      );
    }

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock experience generation
    const experiences: Experience[] = [
      {
        id: `exp_${Date.now()}_1`,
        domain,
        task,
        personas: [
          {
            name: 'Dr. Sarah Chen',
            role: 'doctor',
            traits: ['calm', 'analytical', 'empathetic'],
            background: 'Experienced family physician with 15 years of practice'
          },
          {
            name: 'Alex Rodriguez',
            role: 'patient',
            traits: ['worried', 'cooperative', 'detailed'],
            background: 'Software engineer experiencing fever symptoms'
          }
        ],
        situation: 'Patient reports fever and cough symptoms for 3 days',
        goal: 'Doctor identifies likely cause and recommends appropriate tests or treatment',
        conversation_starter: 'I\'ve had a fever for three days and it\'s not improving. I also have a persistent cough.',
        constraints: {
          max_turns: 12,
          response_style: 'concise and clear'
        }
      },
      {
        id: `exp_${Date.now()}_2`,
        domain,
        task,
        personas: [
          {
            name: 'Jennifer Walsh',
            role: 'customer_service_agent',
            traits: ['patient', 'solution-oriented', 'professional'],
            background: 'Senior customer service representative with expertise in returns'
          },
          {
            name: 'Michael Thompson',
            role: 'customer',
            traits: ['frustrated', 'determined', 'polite'],
            background: 'Recent online shopper seeking refund for defective product'
          }
        ],
        situation: 'Customer received a defective electronic device and wants a refund',
        goal: 'Agent processes refund and maintains customer satisfaction',
        conversation_starter: 'I received my order yesterday, but the device isn\'t working properly. I\'d like to return it for a refund.',
        constraints: {
          max_turns: 10,
          response_style: 'helpful and efficient'
        }
      }
    ];

    return NextResponse.json({
      success: true,
      experiences,
      metadata: {
        generated_at: new Date().toISOString(),
        processing_time_ms: 2000,
        num_experiences
      }
    });

  } catch (error) {
    console.error('Experience generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate experiences' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Experience Generator API',
    endpoints: {
      'POST /api/pipeline/experience-generator': 'Generate new experiences'
    },
    supported_domains: ['healthcare', 'customer_support', 'education', 'business'],
    supported_tasks: {
      healthcare: ['diagnose_fever', 'symptom_check', 'medication_advice'],
      customer_support: ['refund_request', 'technical_support', 'booking_issue'],
      education: ['math_tutoring', 'concept_explanation', 'homework_help'],
      business: ['negotiation', 'project_planning', 'client_meeting']
    }
  });
}
