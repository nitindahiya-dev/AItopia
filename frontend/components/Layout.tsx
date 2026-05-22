// components/Layout.tsx
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { Server } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Function to scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling effect
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow md:max-w-[100vw] mx-auto">{children}</main>
      {/* Floating Status with Scroll-to-Top */}
      <motion.div
        className="fixed bottom-8 right-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full p-4 cursor-pointer"
        animate={{ rotate: [0, 360], scale: [1, 1.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        onClick={handleScrollToTop} // Add click handler
        whileHover={{ scale: 1.2 }} // Optional: Add hover effect for better UX
        whileTap={{ scale: 0.9 }} // Optional: Add tap effect for feedback
      >
        <Server className="w-6 h-6 text-orange" />
      </motion.div>
      <Footer />
    </div>
  );
};

export default Layout;