import {
  Paintbrush,
  Code2,
  BrainCircuit,
  Video,
  Music,
  BookText,
  Speech,
  Bot,
  Lock,
  ImageDown,
  Clapperboard,
} from 'lucide-react';
import { ReactElement } from 'react';

interface Tool {
  name: string;
  category: string;
  icon: ReactElement;
  description: string;
  link: string;
  linkedPackages: string[];
  comingSoon?: boolean;
}

export const allTools: Tool[] = [
  {
    name: 'Artisan AI',
    category: 'Generative AI',
    icon: <Paintbrush className="w-8 h-8" />,
    description: 'Transform text prompts into stunning digital artwork',
    link: '/tools/artisanai',
    linkedPackages: ['Pro', 'Enterprise'],
  },
  {
    name: 'VoiceCraft',
    category: 'Audio',
    icon: <Speech className="w-8 h-8" />,
    description: 'Real-time voice cloning and modulation',
    link: '/tools/voicecraft',
    linkedPackages: ['Pro'],
  },
  {
    name: 'LingoSync',
    category: 'Video',
    icon: <Clapperboard className="w-8 h-8" />,
    description: 'Add subtitles to your video',
    link: '/tools/lingosync',
    linkedPackages: ['Starter', 'Pro'],
  },
  {
    name: 'NeuroChat',
    category: 'Productivity',
    icon: <BrainCircuit className="w-8 h-8" />,
    description: 'Context-aware intelligent chatbot with memory',
    link: '/comingsoon',
    linkedPackages: ['Pro'],
    comingSoon: true,
  },
  {
    name: 'CodeForge',
    category: 'Development',
    icon: <Code2 className="w-8 h-8" />,
    description: 'AI-powered code completion and debugging assistant',
    link: '/comingsoon',
    linkedPackages: ['Enterprise'],
    comingSoon: true,
  },
  {
    name: 'VisionX',
    category: 'Image',
    icon: <ImageDown className="w-8 h-8" />,
    description: 'Advanced image processing and analysis',
    link: '/comingsoon',
    linkedPackages: ['Enterprise'],
    comingSoon: true,
  },
  {
    name: 'DataMiner',
    category: 'Productivity',
    icon: <BrainCircuit className="w-8 h-8" />,
    description: 'Automated data extraction and insights',
    link: '/comingsoon',
    linkedPackages: ['Enterprise'],
    comingSoon: true,
  },
  {
    name: 'QuantumCore',
    category: 'Development',
    icon: <Code2 className="w-8 h-8" />,
    description: 'Quantum computing simulation tool',
    link: '/comingsoon',
    linkedPackages: ['Enterprise'],
    comingSoon: true,
  },
  {
    name: 'TextGenix',
    category: 'Writing',
    icon: <BookText className="w-8 h-8" />,
    description: 'Advanced content generation and rewriting',
    link: '/tools/textgenix',
    linkedPackages: ['Starter', 'Pro'],
  },
  {
    name: 'ImageSynth',
    category: 'Generative AI',
    icon: <ImageDown className="w-8 h-8" />,
    description: 'Text-to-image generation with style control',
    link: '/comingsoon',
    linkedPackages: ['Enterprise'],
    comingSoon: true,
  },
];

export const categories: string[] = [
  'all',
  'Generative AI',
  'Development',
  'Productivity',
  'Image',
  'Video',
  'Audio',
  'Writing',
];