import { useState } from 'react';
import { PenTool, BookOpen, Sparkles, Clipboard, Wand2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Linguo = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tone, setTone] = useState('neutral');
  const [creativity, setCreativity] = useState(75);

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/linguo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText, tone, creativity }),
      });
      if (response.ok) {
        const data = await response.json();
        setOutputText(data.outputText);
      } else {
        console.error('Error generating text');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setIsProcessing(false);
  };
  

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Navigation */}
        <Link href="/tools" className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Tools
        </Link>

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <PenTool className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              Linguo AI
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Advanced AI writing assistant for content generation, rewriting, and optimization
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Your Content</h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to generate or rewrite..."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-6 text-white placeholder-white/30 focus:outline-none focus:border-orange resize-none"
              />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Writing Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                  >
                    <option value="neutral">Neutral</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-aeroport text-white/80">Creativity Level</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={creativity}
                      onChange={(e) => setCreativity(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{creativity}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full bg-orange text-black font-loos-wide py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Wand2 className="w-5 h-5 animate-pulse" />
                    Crafting Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Content
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Quick Prompts</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Blog Post Intro', 'Product Description', 'Social Media Post', 'Email Draft'].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputText(prompt + ' about...')}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange" />
                      <span className="font-aeroport">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-2xl text-orange">AI Output</h2>
              <button 
                className="text-orange hover:text-orange/80 transition-colors flex items-center gap-2"
                onClick={() => navigator.clipboard.writeText(outputText)}
              >
                <Clipboard className="w-5 h-5" />
                Copy
              </button>
            </div>
            
            {isProcessing ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-white/60">Generating content...</div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-64 font-aeroport text-white/80 whitespace-pre-wrap">
                {outputText || 'Your generated content will appear here'}
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureStep
              number="1"
              title="Input Content"
              description="Enter your text or choose a quick start prompt"
            />
            <FeatureStep
              number="2"
              title="Adjust Settings"
              description="Select tone and creativity level for optimal results"
            />
            <FeatureStep
              number="3"
              title="Generate & Refine"
              description="Generate content and refine with follow-up prompts"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureStep = ({ number, title, description }: { 
  number: string;
  title: string;
  description: string;
}) => (
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-xl bg-orange/20 text-orange flex items-center justify-center font-loos-wide">
      {number}
    </div>
    <h3 className="font-loos-wide text-xl text-white">{title}</h3>
    <p className="font-aeroport text-white/80">{description}</p>
  </div>
);

export default Linguo;
