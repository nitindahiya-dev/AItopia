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
              <Code2 className="text-orange w-6 h-6 md:w-8 md:h-8" />
              <span className="font-loos-wide text-xl md:text-2xl text-white uppercase">aitopia</span>
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
              <Menu className="h-6 w-6 md:h-8 md:w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
<div
  className={`md:hidden fixed inset-0 z-[100] bg-custom-black/95 backdrop-blur-xl
  transform ${
    isOpen ? 'translate-x-0' : 'translate-x-full'
  } transition-transform duration-300 ease-in-out`}
>
  <div className="flex flex-col min-h-screen bg-black ">

    {/* Top Bar */}
    <div className="flex items-center justify-between p-5 border-b border-white/10">
      <Link
        href="/"
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-2"
      >
        <Code2 className="text-orange w-6 h-6" />
        <span className="font-loos-wide text-xl text-white uppercase">
          aitopia
        </span>
      </Link>

      <button
        onClick={() => setIsOpen(false)}
        className="p-2 rounded-xl text-white hover:bg-white/10"
      >
        <X className="h-7 w-7" />
      </button>
    </div>

    {/* Navigation */}
    <div className="flex flex-col justify-start flex-1 px-16 gap-6 min-h-[200vh] bg-black">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setIsOpen(false)}
          className="font-loos-wide text-2xl text-white/80 hover:text-orange
          transition-colors duration-200"
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
