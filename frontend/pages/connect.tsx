import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Globe, Phone, CheckCircle } from 'lucide-react';

export default function Connect() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setShowSuccess(true);
    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        <div className="text-center space-y-8">
          <h1 className="uppercase font-loos-wide md:mt-6 text-4xl md:text-6xl xl:text-7xl font-bold text-orange">
            Connect With Us
          </h1>
          <p
            className="font-aeroport text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
          >
            Get in touch with our AI experts and revolutionize your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField 
                label="Name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField 
                label="Email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField 
                label="Message" 
                type="textarea" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                type="submit"
                className="w-full bg-orange text-black font-loos-wide px-8 py-3 rounded-xl"
              >
                Send Message
              </motion.button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <ContactInfo
              icon={<Mail className="w-6 h-6" />}
              title="Email"
              value="support@example.ai"
            />
            <ContactInfo
              icon={<Globe className="w-6 h-6" />}
              title="Website"
              value="example.ai"
            />
            <ContactInfo
              icon={<Phone className="w-6 h-6" />}
              title="Phone"
              value="+1 (555) 123-4567"
            />
          </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                    <CheckCircle className="w-8 h-8 text-orange" />
                  </motion.div>
                </div>
                
                <h3 className="font-loos-wide text-2xl text-orange mb-4">
                  Message Sent!
                </h3>
                <p className="font-aeroport text-white/80 mb-6">
                  Thank you for contacting us. Our team will respond within 24 hours.
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
      </main>
    </div>
  );
}

// Define props interface for InputField
interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField = ({ label, type, value, onChange }: InputFieldProps) => (
  <div className="space-y-2">
    <label className="font-aeroport text-white/80">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange"
        required
      />
    ) : (
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-orange" 
        required
      />
    )}
  </div>
);

// Define props interface for ContactInfo
interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const ContactInfo = ({ icon, title, value }: ContactInfoProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-6"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-xl">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-orange">{title}</h3>
        <p className="font-aeroport text-white/80">{value}</p>
      </div>
    </div>
  </motion.div>
);