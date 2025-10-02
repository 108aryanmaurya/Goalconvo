# GoalConvo - Multi-Agent LLM System for Task-Oriented Dialogue Generation

## 🚀 Overview

GoalConvo is a sophisticated multi-agent LLM-based system that generates high-quality, task-oriented synthetic dialogues. Built on the foundation of the ConvoGen framework, it creates realistic conversations across multiple domains including healthcare, customer support, education, and business scenarios.

## ✨ Key Features

- **Multi-Agent Architecture**: LLM-powered agents simulate realistic conversations
- **Experience Generation**: Creates structured blueprints with personas, situations, and goals
- **Real-time Simulation**: Watch conversations unfold step-by-step
- **Quality Filtering**: Advanced post-processing ensures high-quality outputs
- **Comprehensive Evaluation**: Multi-metric assessment of generated content
- **Futuristic UI**: Modern, interactive interface with real-time progress tracking

## 🏗️ Architecture

The GoalConvo pipeline consists of five main stages:

1. **Experience Generation** - Create conversation blueprints with personas and objectives
2. **Multi-Agent Simulation** - Generate natural dialogues through LLM agent interactions
3. **Post-Processing** - Filter, deduplicate, and ensure quality of generated dialogues
4. **Dataset Construction** - Compile structured dataset with metadata
5. **Evaluation** - Assess quality, diversity, and downstream task performance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React, Heroicons
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS with custom gradient themes
- **Charts**: Recharts for data visualization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional, for enhanced features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goalconvo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env.local
# Add your OpenAI API key if available
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Running the Full Pipeline

1. **Navigate to the main dashboard**
2. **Click "Run Pipeline"** to start the entire process
3. **Watch each stage progress** with real-time updates
4. **Explore generated content** by expanding each section
5. **Export datasets** in JSON format when complete

### Individual Component Testing

- **Experience Generator**: Creates conversation blueprints with diverse personas
- **Multi-Agent Simulator**: Generates realistic multi-turn conversations
- **Post-Processor**: Filters and quality-checks generated content
- **Dataset Constructor**: Structures data for downstream use
- **Evaluator**: Provides comprehensive quality metrics

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Futuristic gradient-based design
- **Real-time Progress**: Visual progress bars and status indicators
- **Interactive Elements**: Expandable sections and hover effects
- **Smooth Animations**: Framer Motion powered transitions

## 📊 Evaluation Metrics

The system evaluates generated conversations across multiple dimensions:

- **Overall Score**: Weighted average of all metrics
- **Diversity Score**: Lexical and structural diversity
- **Coherence Score**: Conversation flow and logic
- **Task Success Rate**: Goal completion percentage
- **Fluency Score**: Natural language quality
- **Groundedness Score**: Persona and context adherence

## 🔧 API Endpoints

### Experience Generator
- `POST /api/pipeline/experience-generator` - Generate conversation experiences

### Multi-Agent Simulator
- `POST /api/pipeline/multi-agent-simulator` - Generate conversations from experiences

### Post-Processor
- `POST /api/pipeline/post-processor` - Filter and quality-check conversations

### Dataset Constructor
- `POST /api/pipeline/dataset-constructor` - Construct structured dataset

### Evaluator
- `POST /api/pipeline/evaluator` - Evaluate dataset quality and performance

## 🎯 Supported Domains

- **Healthcare**: Medical consultations and diagnoses
- **Customer Support**: Helpdesk and service interactions
- **Education**: Tutoring and learning scenarios
- **Business**: Professional and negotiation contexts

## 🔒 Privacy & Ethics

- All generated content is synthetic and for research purposes
- No real personal data is used or stored
- Content safety filters are implemented
- Clear labeling of synthetic vs. real data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the foundation of the ConvoGen framework
- Inspired by research in multi-agent conversational AI
- Thanks to the open-source community for amazing tools and libraries

## 📞 Support

For questions, issues, or contributions, please:

- Open an issue on GitHub
- Start a discussion in the repository
- Reach out to the development team

---

**Made with ❤️ for advancing conversational AI research**