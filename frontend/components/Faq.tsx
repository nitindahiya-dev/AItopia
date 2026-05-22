import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const faqItems = [
    {
      question: "How can I connect the Progressors?",
      answer: "Connect through our web platform or mobile app using your existing work credentials or by creating a new account. Integration with common workplace tools is available through our API."
    },
    {
      question: "What is included in the Progressors?",
      answer: "The Progressors includes team collaboration tools, AI-powered analytics, workflow automation, and integrations with popular productivity suites. All plans come with basic security features and 24/7 support."
    },
    {
      question: "How much does it cost?",
      answer: "Only $8 per month for core communication and entertainment features. Additional services and premium subscriptions available à la carte or through bundled packages."
    }
  ];

  return (
    <div className="md:w-[70vw] mt-[200px] mx-auto mb-40 relative z-10">
      <div className="bg-orange/10 backdrop-blur-lg border border-orange/20 rounded-[40px] p-8 md:p-16">
        <h2 className="uppercase font-loos-wide text-5xl md:text-7xl font-bold text-center mb-12 md:mb-20 text-orange">
          FAQ
        </h2>

        <div className="grid gap-6 md:gap-12">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden"
            >
              <button
                className="w-full transform transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                  bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 
                  hover:bg-white/10 text-left"
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl md:text-3xl font-loos-wide font-bold text-orange mr-4">
                    {item.question}
                  </h3>
                  <span className="text-orange mt-1">
                    {activeIndex === index ? 
                      <ChevronUp className="w-6 h-6" /> : 
                      <ChevronDown className="w-6 h-6" />
                    }
                  </span>
                </div>
                
                <div
                  id={`faq-content-${index}`}
                  className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
                  style={{
                    maxHeight: activeIndex === index ? '500px' : '0px',
                    opacity: activeIndex === index ? 1 : 0
                  }}
                >
                  <p className="pt-4 md:pt-6 text-base md:text-xl font-aeroport text-white/80 leading-normal border-t border-white/10">
                    {item.answer}
                    {index === 2 && (
                      <span className="block mt-3 md:mt-4">
                        Additional services and foreign platform payments available through 
                        our global partnership network.
                      </span>
                    )}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;