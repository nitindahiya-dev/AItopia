import Link from 'next/link';
import { Code2, BrainCircuit, Rocket, Mail, Twitter, Github, Tornado } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="md:w-[70vw]  mx-auto pb-10 px-4">
      <div className="border-t border-white/10 pt-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Code2 className="text-orange w-8 h-8" />
              <span className="font-loos-wide text-2xl text-white uppercase">aitopia</span>
            </Link>
            <p className="font-aeroport text-white/80 text-lg">
              Empowering innovation through AI-powered solutions
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-loos-wide text-white text-xl mb-4">Explore</h3>
            <div className="flex flex-col gap-3">
              <Link href="/tools" className="footer-link">
                AI Tools
              </Link>
              <Link href="/about" className="footer-link">
                About Us
              </Link>
              <Link href="/connect" className="footer-link">
                Contact
              </Link>
              <Link href="/faq" className="footer-link">
                Faq
              </Link>
            </div>
          </div>

          {/* Tools Categories */}
          <div className="space-y-4">
            <h3 className="font-loos-wide text-white text-xl mb-4">Categories</h3>
            <div className="flex flex-col gap-3">
              <Link href="/categories" className="flex items-center gap-2 footer-link">
                <Tornado className="w-5 h-5" />
                <span>All Tools</span>
              </Link>
              <Link
                href="/categories?category=Generative%20AI"
                className="flex items-center gap-2 footer-link"
              >
                <BrainCircuit className="w-5 h-5" />
                <span>Generative AI</span>
              </Link>
              <Link
                href="/categories?category=Productivity"
                className="flex items-center gap-2 footer-link"
              >
                <Rocket className="w-5 h-5" />
                <span>Productivity</span>
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-loos-wide text-white text-xl mb-4">Stay Updated</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 text-white placeholder-white/30 focus:outline-none focus:border-orange"
              />
              <button className="bg-orange text-black font-loos-wide px-6 py-3 rounded-xl hover:bg-orange/80 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-aeroport text-white/60 text-center md:text-left">
            © {new Date().getFullYear()} AItopia. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-link">
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="mailto:contact@example.ai" className="social-icon">
              <Mail className="w-5 h-5" />
            </Link>
            <Link href="#" className="social-icon">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://github.com/nitindahiya-dev/AItopia" target="_blank" className="social-icon">
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;