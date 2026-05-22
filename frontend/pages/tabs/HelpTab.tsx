import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LifeBuoy, Sparkles } from 'lucide-react';
import Link from 'next/link';

const HelpTab: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Show success message and reset form
      setShowSuccess(true);
      setSubject('');
      setMessage('');
    };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h2 className="font-loos-wide text-3xl text-orange">Support Center</h2>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Quick Assistance</h3>
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-loos-wide text-lg mb-4">Common Solutions</h4>
              <div className="space-y-3">
                {['Password Reset', 'Billing Issues', 'API Documentation', 'Service Status'].map((item, index) => (
                  <Link key={index} href="/faq" passHref>
                    <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer">
                      <LifeBuoy className="w-5 h-5 text-orange" />
                      {item}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-loos-wide text-lg mb-4">Live Support</h4>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-green-400/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div>
                  <p className="font-loos-wide">Support Team Available</p>
                  <p className="font-aeroport text-white/60">Average response time: 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-loos-wide text-xl mb-6">Contact Form</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              required
            />
            <textarea
              placeholder="Describe your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="w-full py-4 bg-orange text-black rounded-xl font-loos-wide"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
 
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-custom-black border-2 border-orange/30 rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="flex justify-center mb-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-orange/20 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-orange"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              </div>
              
              <h3 className="font-loos-wide text-2xl text-orange mb-4">
                Message Received!
              </h3>
              <p className="font-aeroport text-white/80 mb-6">
                Thank you for contacting us. {`We'll`} respond within 24 hours.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowSuccess(false)}
                className="bg-orange text-black px-8 py-3 rounded-xl font-loos-wide"
              >
                Close Notification
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </motion.div>
  );
};

export default HelpTab;