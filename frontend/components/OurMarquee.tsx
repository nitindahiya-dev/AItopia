import { ImageDown, Clapperboard, Paintbrush, Code2, BrainCircuit, Video, Music, BookText, Speech, Bot, Lock } from 'lucide-react';
import React from 'react';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';

const OurMarquee = () => {
  const tools = [
    {
      name: 'RemoveBG',
      category: 'Image',
      icon: <ImageDown className="w-6 h-6" />,
      description: 'Instantly remove backgrounds from images',
      link: '/tools/removebg'
    },
    {
      name: 'LingoSync',
      category: 'Video',
      icon: <Clapperboard className="w-6 h-6" />,
      description: 'Add subtitle to the video',
      link: '/tools/lingosync'
    },
    {
      name: 'Artisan AI',
      category: 'Generative AI',
      icon: <Paintbrush className="w-6 h-6" />,
      description: 'Transform text prompts into stunning digital artwork',
      link: '/tools/artrisanai'
    },
    {
      name: 'Code Pilot',
      category: 'Development',
      icon: <Code2 className="w-6 h-6" />,
      description: 'AI-powered code completion and debugging assistant',
      link: '/comingsoon'
    },
    {
      name: 'NeuroChat',
      category: 'Productivity',
      icon: <BrainCircuit className="w-6 h-6" />,
      description: 'Context-aware intelligent chatbot with memory',
      link: '/comingsoon'
    },
    {
      name: 'Motion Forge',
      category: 'Video',
      icon: <Video className="w-6 h-6" />,
      description: 'Automated video editing and scene generation',
      link: '/comingsoon'
    },
    {
      name: 'Symphony AI',
      category: 'Audio',
      icon: <Music className="w-6 h-6" />,
      description: 'AI music composition and sound design tool',
      link: '/comingsoon'
    },
    {
      name: 'Linguo',
      category: 'Writing',
      icon: <BookText className="w-6 h-6" />,
      description: 'Advanced content generation and rewriting',
      link: '/tools/linguo'
    },
    {
      name: 'VoiceCraft',
      category: 'Audio',
      icon: <Speech className="w-6 h-6" />,
      description: 'Real-time voice cloning and modulation',
      link: '/tools/voicecraft'
    },
    {
      name: 'PixelGen',
      category: 'Generative AI',
      icon: <ImageDown className="w-6 h-6" />,
      description: 'Text-to-image generation with style control',
      link: '/comingsoon'
    },
    {
      name: 'AutoBot',
      category: 'Automation',
      icon: <Bot className="w-6 h-6" />,
      description: 'Workflow automation with natural language',
      link: '/comingsoon'
    },
    {
      name: 'CipherGuard',
      category: 'Security',
      icon: <Lock className="w-6 h-6" />,
      description: 'AI-powered cybersecurity threat detection',
      link: '/comingsoon'
    }
  ];

  return (
    <div className="relative max-w-[100vw] overflow-hidden bg-custom-black py-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-orange/10 to-amber-500/10 blur-3xl -top-48 -left-48 rounded-full" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-orange/20 to-transparent blur-2xl bottom-0 right-0" />
      </div>

      <div className="relative z-10 mx-auto mb-20 space-y-12">
        {/* Header */}
        <div className="text-center sm:w-[70vw] mx-auto ">
          <h2 className="mb-10 h-28 font-loos-wide text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange to-amber-500 bg-clip-text text-transparent">
            Explore Our AI Tools Ecosystem
          </h2>
        </div>

        {/* Marquee Tools */}
        <div className="space-y-8">
          <Marquee gradientColor="rgb(18,18,18)" speed={35}>
            {[...tools, ...tools].map((tool, index) => (
              <Link href={tool.link} key={`${tool.name}-${index}`} className="ml-5 flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-orange/30 transition-all">
                <div className="p-2 bg-orange/20 rounded-lg text-orange">
                  {tool.icon}
                </div>
                <div>
                  <span className="font-loos-wide text-2xl">{tool.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${tool.link === '/comingsoon' ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
                    <span className="font-aeroport text-xs text-white/60">
                      {tool.link === '/comingsoon' ? 'Coming Soon' : tool.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Marquee>

          <Marquee direction="right" gradientColor="rgb(18,18,18)" speed={35}>
            {[...tools, ...tools].map((tool, index) => (
              <div key={`${tool.name}-reverse-${index}`} className="ml-5 flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-orange/30 transition-all">
                <div className="p-2 bg-purple-400/20 rounded-lg text-purple-400">
                  {tool.icon}
                </div>
                <div>
                  <span className="font-loos-wide text-2xl">{tool.name}</span>
                  <span className="block font-aeroport text-xs text-white/60">
                    {tool.description}
                  </span>
                </div>
              </div>
            ))}
          </Marquee>

          <Marquee gradientColor="rgb(18,18,18)" speed={35}>
            {[...tools, ...tools].map((tool, index) => (
              <div key={`${tool.name}-alt-${index}`} className="ml-5 flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 hover:border-orange/30 transition-all">
                <div className="p-2 bg-blue-400/20 rounded-lg text-blue-400">
                  {tool.icon}
                </div>
                <div>
                  <span className="font-loos-wide text-2xl">{tool.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-aeroport text-xs text-white/60">
                      {tool.category}
                    </span>
                    <span className="text-xs text-orange">•</span>
                    <span className="font-aeroport text-xs text-white/60">
                      {tool.link === '/comingsoon' ? 'Beta' : 'Live'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default OurMarquee;
