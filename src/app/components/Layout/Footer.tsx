"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faProjectDiagram,
  faUserShield,
  faEnvelope,
  faPhone,
  faHome,
  faServer,
  faGlobe,
  faBlog,
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import SocialIcons from "./SocialIcons";
import { useState } from "react";

interface SubscriptionStatus {
  loading: boolean;
  success: boolean;
  error: string;
  emailExists?: boolean;
  phoneExists?: boolean;
  nameExists?: boolean;
  conflictingSubscribers?: boolean;
  updated?: boolean;
  formerlyConflicting?: boolean;
  existingData?: boolean;
  updatedFields?: string[];
  unsubscribePrefs?: {
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
  };
}

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: false
  });
  const [status, setStatus] = useState<SubscriptionStatus>({
    loading: false,
    success: false,
    error: ""
  });
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({
      loading: true,
      success: false,
      error: ""
    });

    try {
      // Always use the update endpoint which creates new records
      const endpoint = '/api/newsletter/update';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle errors
        setStatus({
          loading: false,
          success: false,
          error: result.error || 'Failed to subscribe to newsletter'
        });
        throw new Error(result.error || 'Failed to subscribe to newsletter');
      }

      // Success
      setStatus({
        loading: false,
        success: true,
        error: "",
        formerlyConflicting: result.formerlyConflicting,
        existingData: result.existingData
      });

      // Reset form and state
      setFormData({ name: "", email: "", phone: "", whatsapp: false });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus(prevStatus => ({
          ...prevStatus,
          success: false,
          updated: false,
          updatedFields: undefined,
          formerlyConflicting: false,
          existingData: false
        }));
      }, 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1A1A1A] relative overflow-hidden">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      <div className="nextjs-container relative py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="col-span-1 flex flex-col items-center">
            <Link href="/" className="flex items-center group mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <FontAwesomeIcon 
                  icon={faShieldHalved} 
                  className="relative text-blue-500 mr-3 w-5 h-5 group-hover:text-blue-400 transition-colors duration-300" 
                />
              </div>
              <span className="text-base md:text-lg font-medium tracking-wide text-zinc-100 group-hover:text-zinc-50 transition-colors duration-300">
                amananilofficial
              </span>
            </Link>
            <p className="text-zinc-500 mb-6 md:mb-8 max-w-[280px] text-center text-sm leading-relaxed">
              Leading the frontier in cyber crime prevention and AIDS research security.
            </p>
            <div className="block sm:hidden md:block w-full max-w-[280px] flex justify-center">
              <SocialIcons />
            </div>
          </div>

          {/* Navigation Section */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 md:mb-6">Navigation</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 md:gap-4 w-full max-w-[280px] sm:max-w-none">
              {[
                { name: "Home", icon: faHome, href: "/" },
                { name: "Services", icon: faServer, href: "/services" },
                { name: "Projects", icon: faProjectDiagram, href: "/projects" },
                { name: "About", icon: faUserShield, href: "/about" },
                { name: "Contact", icon: faGlobe, href: "/contact" },
                { name: "Blog", icon: faBlog, href: "/blog" }
              ].map((item) => (
                <li key={item.name} className="w-full">
                  <Link 
                    href={item.href} 
                    className="flex items-center justify-center sm:justify-start text-zinc-500 hover:text-zinc-300 transition-colors duration-200 group py-1.5"
                  >
                    <div className="w-5 h-5 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className="text-zinc-600 group-hover:text-blue-500 transition-colors duration-200 w-3.5 h-3.5 md:w-4 md:h-4" 
                      />
                    </div>
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 md:mb-6">Contact</h3>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4 w-full max-w-[280px] sm:max-w-none">
              <li>
                <a 
                  href="mailto:info@amananilofficial.com" 
                  className="flex items-start sm:items-center justify-center sm:justify-start text-zinc-500 hover:text-zinc-300 transition-colors duration-200 group py-1.5"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="text-zinc-600 group-hover:text-blue-500 transition-colors duration-200 w-3.5 h-3.5 md:w-4 md:h-4" 
                    />
                  </div>
                  <span className="text-sm font-medium break-words text-center sm:text-left">info@amananilofficial.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:amananil.cyber@proton.me" 
                  className="flex items-start sm:items-center justify-center sm:justify-start text-zinc-500 hover:text-zinc-300 transition-colors duration-200 group py-1.5"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="text-zinc-600 group-hover:text-blue-500 transition-colors duration-200 w-3.5 h-3.5 md:w-4 md:h-4" 
                    />
                  </div>
                  <span className="text-sm font-medium break-words text-center sm:text-left">amananil.cyber@proton.me</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+917892939127" 
                  className="flex items-center justify-center sm:justify-start text-zinc-500 hover:text-zinc-300 transition-colors duration-200 group py-1.5"
                >
                  <div className="w-5 h-5 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                    <FontAwesomeIcon 
                      icon={faPhone} 
                      className="text-zinc-600 group-hover:text-blue-500 transition-colors duration-200 w-3.5 h-3.5 md:w-4 md:h-4" 
                    />
                  </div>
                  <span className="text-sm font-medium text-center sm:text-left">+91 7892939127</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 md:mb-6">Newsletter</h3>
            <div className="w-full max-w-[280px] sm:max-w-xs">
              {status.success ? (
                <div className="w-full bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-md backdrop-blur-sm transition-opacity duration-300">
                  <p className="text-center text-zinc-300 text-sm">
                    {status.formerlyConflicting
                      ? "Thanks for subscribing! A new record has been created."
                      : status.existingData
                        ? "Thanks for subscribing! Your information has been saved."
                        : "Thanks for subscribing!"}
                  </p>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="w-full space-y-3 md:space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        className="w-full px-3 md:px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm text-center sm:text-left"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your Email"
                        required
                        className="w-full px-3 md:px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm text-center sm:text-left"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your Phone Number"
                        required
                        className="w-full px-3 md:px-4 py-2.5 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm text-center sm:text-left"
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          className="text-zinc-600 w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0"
                        />
                        <label htmlFor="whatsapp" className="text-zinc-500 text-xs md:text-sm">
                          Contact me on WhatsApp
                        </label>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          id="whatsapp"
                          name="whatsapp"
                          checked={formData.whatsapp}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 md:w-10 md:h-5 bg-zinc-800/50 peer-focus:outline-none rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-zinc-700 after:border after:rounded-full 
                          after:h-4 after:w-4 after:transition-all 
                          peer-checked:bg-blue-500/50"></div>
                      </label>
                    </div>
                    {status.error && (
                      <div className="text-red-400/90 text-xs md:text-sm bg-red-500/10 border border-red-500/20 p-2 rounded-md transition-opacity duration-300 text-center sm:text-left">
                        {status.error}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={status.loading}
                      className={`w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 border border-zinc-800/50 ${
                        status.loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {status.loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full"></span>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-3 md:mt-4 text-xs text-zinc-600 text-center sm:text-left">
                    <button
                      onClick={() => setShowUnsubscribe(prev => !prev)}
                      className="text-zinc-500 hover:text-zinc-400 transition-colors underline"
                    >
                      Already subscribed? Unsubscribe here
                    </button>
                  </div>

                  {showUnsubscribe && (
                    <div className="mt-3 md:mt-4 w-full transition-all duration-300">
                      <div className="bg-zinc-900/50 border border-zinc-800/50 p-3 md:p-4 rounded-md backdrop-blur-sm">
                        <p className="text-center text-zinc-400 text-xs md:text-sm">
                          To unsubscribe, please contact us at info@amananilofficial.com
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 md:mt-16 pt-6 md:pt-8 border-t border-zinc-800/30 text-center">
          <Link href="/" className="inline-block hover:text-zinc-400 transition-colors duration-200">
            <p className="text-zinc-600 text-xs tracking-wide">
              © {new Date().getFullYear()} amananilofficial. All rights reserved.
            </p>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;