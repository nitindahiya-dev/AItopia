import Image from 'next/image';
import aiTeam from '../public/img/ai-team.jpg';

export default function About() {
  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide md:mt-6 text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Revolutionizing AI Tools
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
            Empowering creators and innovators with cutting-edge artificial intelligence solutions
          </p>
        </div>

        {/* Image Section */}
        <div className="relative h-96 rounded-3xl overflow-hidden border border-white/10">
          <Image
            src={aiTeam}
            alt="AI Development Team"
            layout="fill"
            objectFit="cover"
            className="opacity-90"
          />
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          <SectionBlock 
            title="Our Mission"
            content="Democratizing access to advanced AI tools for creators worldwide. We believe in empowering innovation through accessible artificial intelligence solutions."
          />
          
          <SectionBlock
            title="The Technology"
            content="Leveraging state-of-the-art machine learning models and neural networks to deliver unparalleled performance and accuracy in our tools."
          />

          <div className="grid md:grid-cols-2 gap-8">
            <StatBlock number="100K+" label="Active Users" />
            <StatBlock number="50+" label="AI Tools Available" />
          </div>
        </div>
      </main>
    </div>
  );
}

type SectionBlockProps = {
  title: string;
  content: string;
};

const SectionBlock: React.FC<SectionBlockProps> = ({ title, content }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
    <h2 className="font-loos-wide text-2xl md:text-3xl text-orange mb-4">{title}</h2>
    <p className="font-aeroport text-white/80 text-lg md:text-xl leading-relaxed">
      {content}
    </p>
  </div>
);

type StatBlockProps = {
  number: string;
  label: string;
};

const StatBlock: React.FC<StatBlockProps> = ({ number, label }) => (
  <div className="border border-orange/20 rounded-3xl p-6 text-center">
    <div className="font-loos-wide text-4xl md:text-5xl text-orange">{number}</div>
    <div className="font-aeroport text-white/80 text-lg mt-2">{label}</div>
  </div>
);
