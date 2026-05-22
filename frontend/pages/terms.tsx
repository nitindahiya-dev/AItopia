// pages/terms.tsx
const Terms = () => {
  return (
    <div className="min-h-screen bg-custom-black">
      
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Terms of Service
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            By using our services, you agree to these terms. Please read them carefully.
          </p>
        </div>

        <div className="space-y-12">
          <TermsSection
            title="1. Acceptance of Terms"
            content="By accessing or using the AItopia platform, you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the service."
          />

          <TermsSection
            title="2. User Responsibilities"
            content="You agree to use our AI tools responsibly and lawfully. Any misuse or unauthorized access may result in termination of your account."
          />

          <TermsSection
            title="3. Intellectual Property"
            content="All content and AI models provided through the service are the property of AITopia and protected by intellectual property laws."
          />

          <TermsSection
            title="4. Limitation of Liability"
            content="AITopia shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services."
          />

          <TermsSection
            title="5. Termination"
            content="We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever."
          />

          <TermsSection
            title="6. Governing Law"
            content="These terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States."
          />
        </div>
      </main>
      
    </div>
  );
};

const TermsSection = ({ title, content }: { title: string; content: string }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
    <h2 className="font-loos-wide text-2xl md:text-3xl text-orange mb-4">{title}</h2>
    <p className="font-aeroport text-white/80 text-lg md:text-xl leading-relaxed">
      {content}
    </p>
  </div>
);

export default Terms;