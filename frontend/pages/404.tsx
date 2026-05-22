import { Bot, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 text-center">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 space-y-12">
          {/* Animated 404 Illustration */}
          <div className="relative mx-auto w-64 h-64">
            <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-purple/20 rounded-full blur-xl animate-pulse" />
            <div className="relative flex items-center justify-center">
              <Bot className="w-48 h-48 text-orange" />
              <div className="absolute -top-8 right-0 font-loos-wide text-9xl text-white/10">404</div>
            </div>
          </div>

          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl text-orange">
            Lost in the Code
          </h1>
          
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Our neural networks {`can't`} find this page. {`Let's`} get you back to familiar territory.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/" className="bg-orange text-black font-loos-wide px-8 py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
            <button className="bg-white/5 border border-white/10 font-loos-wide px-8 py-4 rounded-xl hover:bg-white/10 transition-all">
              Search Tools
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default NotFoundPage;