import React, { useState } from 'react';
import Link from 'next/link';
import { Code2, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Navigation items. Login is only shown if user is not logged in;
  // Dashboard is shown only if user is logged in.
  const navigation = [
    { name: 'AI Tools', href: '/tools' },
    { name: 'About', href: '/about' },
    { name: 'How to Connect', href: '/connect' },
    ...(!user
      ? [{ name: 'Login', href: '/login' }]
      : [{ name: 'Dashboard', href: '/dashboard' }])
  ];

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:max-w-[70vw] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
              <Code2 className="text-orange w-8 h-8" />
              <span className="font-loos-wide text-2xl text-white uppercase">aitopia</span>
            </Link>
            

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-loos-wide text-white/80 hover:text-orange px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/5 group"
                >
                  {item.name}
                  <div className="h-0.5 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-white bg-black hover:bg-white/10 transition-colors"
            >
              <Menu className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-custom-black/95 backdrop-blur-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out border-l border-white/10`}>
        <div className="flex flex-col h-[100vh]">
          <div className="flex justify-end p-4 bg-black">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col px-4 space-y-4 bg-black h-[100vh] z-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="font-loos-wide text-white/80 hover:text-orange px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-white/5"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
