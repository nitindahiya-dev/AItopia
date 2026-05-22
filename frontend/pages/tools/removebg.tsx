import { useState } from 'react';
import { Upload, ImageDown, Wand2, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const RemoveBG = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Display a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Prepare form data to send to the backend
      const formData = new FormData();
      formData.append('image', file);

      setIsProcessing(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/removebg`, {
          method: 'POST',
          body: formData,
        });
        

        if (response.ok) {
          const blob = await response.blob();
          const processedUrl = URL.createObjectURL(blob);
          setProcessedImage(processedUrl);
        } else {
          console.error('Error processing image');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setIsProcessing(false);
    }
  };

  // Download handler: Create a temporary link and trigger click
  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <ImageDown className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              Remove Background
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Instantly remove backgrounds from your images with AI-powered precision
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center hover:border-orange transition-all group">
                <div className="space-y-6">
                  <Upload className="w-16 h-16 mx-auto text-orange" />
                  <div className="space-y-2">
                    <h3 className="font-loos-wide text-2xl text-white">
                      {selectedImage ? 'Image Ready' : 'Upload Image'}
                    </h3>
                    <p className="font-aeroport text-white/80">
                      {selectedImage ? 'Click to change image' : 'PNG or JPG (max 10MB)'}
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Processing / Result Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Wand2 className="w-16 h-16 animate-pulse text-orange" />
                <p className="font-loos-wide text-2xl text-white">Magically Removing Background...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {processedImage ? (
                  <>
                    <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden">
                      <Image 
                        src={processedImage} 
                        alt="Processed result" 
                        className="w-full h-full object-contain"
                        width={100}
                        height={100}
                      />
                    </div>
                    <button 
                      onClick={handleDownload}
                      className="w-full bg-orange text-black font-loos-wide py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center justify-center gap-3"
                    >
                      <Download className="w-5 h-5" />
                      Download Result
                    </button>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40">
                    <p className="font-aeroport">Processed image will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureStep
              number="1"
              title="Upload Image"
              description="Select or drag-and-drop your image into the upload area"
            />
            <FeatureStep
              number="2"
              title="AI Processing"
              description="Our backend AI agent removes the background automatically"
            />
            <FeatureStep
              number="3"
              title="Download Result"
              description="Get your transparent background image in PNG format"
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

export default RemoveBG;
