import { useState } from 'react';
import { Paintbrush, Palette, Sparkles, Download, ArrowLeft, ImagePlus, GalleryHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ArtrisanAi = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('digital-art');
  const [creativity, setCreativity] = useState(85);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `artwork_variation_${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  
  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/generate-art`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          creativity,
          aspectRatio
        })
      });
      const data = await response.json();
      if (data.error) {
        console.error('Image generation error:', data.error);
      } else {
        setGeneratedImages(data.images);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <Link href="/tools" className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Tools
        </Link>
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Paintbrush className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              Artisan AI
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Transform text prompts into stunning digital artwork with AI-powered creativity
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Creation Panel</h2>
              <div className="space-y-4">
                <label className="font-aeroport text-white/80">
                  Describe your artwork
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A cyberpunk cityscape at night with neon lights reflecting in the rain..."
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 mt-2 text-white placeholder-white/30 focus:outline-none focus:border-orange resize-none"
                  />
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-aeroport text-white/80">Art Style</label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
                    >
                      <option value="digital-art">Digital Art</option>
                      <option value="oil-painting">Oil Painting</option>
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="watercolor">Watercolor</option>
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-aeroport text-white/80">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-4 py-2 rounded-lg ${
                            aspectRatio === ratio
                              ? 'bg-orange text-black'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
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
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      Painting Your Vision...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5" />
                      Generate Artwork
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Style Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Digital Art', 'Oil Painting', 'Cyberpunk', 'Watercolor'].map((style) => (
                  <div
                    key={style}
                    className="group relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end">
                      <span className="font-loos-wide text-white">{style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-loos-wide text-2xl text-orange">Generated Artworks</h2>
              <div className="flex items-center gap-4">
                <span className="font-aeroport text-white/60">{generatedImages.length} results</span>
                <button className="text-orange hover:text-orange/80">
                  <GalleryHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
            {isProcessing ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-6">
                <Palette className="w-16 h-16 animate-spin text-orange" />
                <p className="font-loos-wide text-2xl text-white">Creating Masterpiece...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((img, index) => (
                  <div key={index} className="group relative aspect-square bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-orange transition-all">
                    <Image
                      src={img}
                      alt="Generated artwork"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between">
                      <span className="font-aeroport text-white">Variation #{index + 1}</span>
                      <button 
                        onClick={() => handleDownloadImage(img, index)}
                        className="text-orange hover:text-orange/80"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {generatedImages.length > 0 && (
              <button className="w-full bg-white/5 border border-white/10 py-4 rounded-xl hover:bg-white/10 transition-all">
                Load More Variations
              </button>
            )}
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">Creation Process</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureStep
              icon={<Sparkles className="w-8 h-8" />}
              title="Describe Your Vision"
              description="Enter detailed text prompts to guide the AI"
            />
            <FeatureStep
              icon={<Palette className="w-8 h-8" />}
              title="Customize Style"
              description="Choose from various artistic styles and parameters"
            />
            <FeatureStep
              icon={<Download className="w-8 h-8" />}
              title="Generate & Refine"
              description="Create multiple variations and refine results"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureStep = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-lg text-orange">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-xl text-white">{title}</h3>
        <p className="font-aeroport text-white/80">{description}</p>
      </div>
    </div>
  </div>
);

export default ArtrisanAi;
