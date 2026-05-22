import { ChevronRight, Lock, CreditCard, Code, Activity } from 'lucide-react';
import Link from 'next/link';

// Define types for SectionBlock props
interface SectionBlockProps {
  icon: React.ReactNode;
  title: string;
  content: { q: string; a: string }[];
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Support Center
          </h1>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-4xl mx-auto">
            Find answers to common questions about our platform, services, and account management
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <SectionBlock
            icon={<Lock className="w-6 h-6 text-orange" />}
            title="Password & Account Security"
            content={[
              {
                q: "How do I reset my password?",
                a: "Visit the login page and click 'Forgot Password'. Enter your email to receive a secure reset link valid for 1 hour.",
              },
              {
                q: "Can I enable two-factor authentication?",
                a: "Yes! Navigate to Security Settings in your account dashboard to set up 2FA using authenticator apps like Google Authenticator.",
              },
            ]}
          />

          <SectionBlock
            icon={<CreditCard className="w-6 h-6 text-orange" />}
            title="Billing & Subscriptions"
            content={[
              {
                q: "How can I update my payment method?",
                a: "Go to Billing Settings > Payment Methods. You can add new cards or update existing ones securely.",
              },
              {
                q: "What's your refund policy?",
                a: "We offer full refunds for annual plans within 14 days. Monthly subscriptions can be canceled anytime.",
              },
            ]}
          />

          <SectionBlock
            icon={<Code className="w-6 h-6 text-orange" />}
            title="API & Development"
            content={[
              {
                q: "Where can I find API documentation?",
                a: "Visit our Developer Portal for comprehensive docs, code samples, and interactive API testing.",
              },
              {
                q: "What authentication methods do you support?",
                a: "We support OAuth 2.0 and API keys. All communication is encrypted via TLS 1.3.",
              },
            ]}
          />

          <SectionBlock
            icon={<Activity className="w-6 h-6 text-orange" />}
            title="Service Status"
            content={[
              {
                q: "How do I check system status?",
                a: "Our Status Page provides real-time updates on all services. Subscribe for incident alerts.",
              },
              {
                q: "What's your uptime guarantee?",
                a: "We guarantee 99.9% uptime for all paid plans with 24/7 monitoring and immediate incident response.",
              },
            ]}
          />
        </div>

        {/* CTA Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6">
          <h2 className="font-loos-wide text-2xl text-orange">Still need help?</h2>
          <p className="font-aeroport text-white/80 max-w-2xl mx-auto">
            Our support team is available 24/7 to assist you with any questions or technical issues
          </p>
          <div className="w-96 mx-auto flex items-center">
            <Link
              href={'/connect'}
              className="bg-orange text-black px-8 py-3 rounded-xl font-loos-wide hover:bg-amber-500 transition-all flex items-center gap-2 mx-auto"
            >
              Contact Support
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const SectionBlock: React.FC<SectionBlockProps> = ({ icon, title, content }) => (
  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
    <div className="flex items-center gap-4 mb-6">
      {icon}
      <h2 className="font-loos-wide text-2xl text-orange">{title}</h2>
    </div>

    <div className="space-y-6">
      {content.map((item, index) => (
        <div key={index} className="group">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-orange rounded-full mt-3" />
            <div className="flex-1">
              <h3 className="font-loos-wide text-lg text-white mb-2">{item.q}</h3>
              <p className="font-aeroport text-white/80">{item.a}</p>
            </div>
          </div>
          {index !== content.length - 1 && <div className="h-px bg-white/10 my-6" />}
        </div>
      ))}
    </div>
  </div>
);