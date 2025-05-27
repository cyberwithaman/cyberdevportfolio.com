"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faServer,
  faDiagramProject,
  faCircleInfo,
  faEnvelope,
  faXmark,
  faShieldHalved,
  faNewspaper
} from "@fortawesome/free-solid-svg-icons";
import SocialIcons from "./SocialIcons";

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Set initial active path
    setActivePath(window.location.pathname);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: faHome },
    { name: "Services", href: "/services", icon: faServer },
    { name: "Projects", href: "/projects", icon: faDiagramProject },
    { name: "Blog", href: "/blog", icon: faNewspaper },
    { name: "About", href: "/about", icon: faCircleInfo },
    { name: "Contact", href: "/contact", icon: faEnvelope },
  ];

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scroll when mobile menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobileMenuOpen) {
        toggleMobileMenu();
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isMobileMenuOpen, toggleMobileMenu]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0A0A]/80 backdrop-blur-md border-b border-[#1A1A1A]' 
          : 'bg-transparent'
      }`}
    >
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      <div className="nextjs-container relative">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center group relative z-10"
            aria-label="Home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <FontAwesomeIcon 
                icon={faShieldHalved} 
                className="relative text-blue-500 mr-3 w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" 
              />
            </div>
            <span className="text-lg font-medium tracking-wide text-zinc-100 group-hover:text-zinc-50 transition-colors duration-300">
              amananilofficial
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activePath === item.href
                    ? 'text-zinc-100 bg-zinc-900/50 border border-zinc-800/50'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                }`}
                aria-current={activePath === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative z-50 p-2 rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30 transition-colors duration-200"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`fixed top-0 right-0 bottom-0 w-full max-w-[100%] bg-[#0A0A0A] border-l border-[#1A1A1A] md:hidden transform transition-transform duration-300 ease-in-out z-40 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            willChange: 'transform',
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
          }}
        >
          {/* Mobile Menu Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
              <Link 
                href="/" 
                className="flex items-center group mx-auto"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <FontAwesomeIcon 
                    icon={faShieldHalved} 
                    className="relative text-blue-500 mr-3 w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" 
                  />
                </div>
                <span className="text-base sm:text-lg font-medium tracking-wide text-zinc-100 group-hover:text-zinc-50 transition-colors duration-300">
                  amananilofficial
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-4 p-2 rounded-md text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900/30 transition-colors duration-200"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2 max-w-[280px] mx-auto">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-center px-4 py-3.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        activePath === item.href
                          ? 'text-zinc-100 bg-zinc-900/50 border border-zinc-800/50'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                      }`}
                      aria-current={activePath === item.href ? 'page' : undefined}
                    >
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className="w-4 h-4 mr-3 text-zinc-600" 
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-zinc-800/50">
              <div className="max-w-[280px] mx-auto flex justify-center">
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 z-30"
            style={{ willChange: 'opacity' }}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
};

export default NavBar;