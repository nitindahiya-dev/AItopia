import React from 'react';

// Define types for PrivacySection props
interface PrivacySectionProps {
  title: string;
  content: string;
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Privacy Policy
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Your data security is our top priority. Learn how we protect and manage your information.
          </p>
        </div>

        <div className="space-y-12">
          <PrivacySection
            title="Data Collection"
            content="We only collect essential information required to provide and improve our services. Your data is never sold to third parties."
          />
          
          <PrivacySection
            title="Security Measures"
            content="All data is encrypted using military-grade encryption protocols. Regular security audits ensure maximum protection."
          />

          <PrivacySection
            title="User Rights"
            content="You have full control over your data. Request access, modification, or deletion of your information at any time."
          />
        </div>
      </main>
    </div>
  );
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ title, content }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
    <h2 className="font-loos-wide text-2xl md:text-3xl text-orange mb-4">{title}</h2>
    <p className="font-aeroport text-white/80 text-lg md:text-xl leading-relaxed">
      {content}
    </p>
  </div>
);