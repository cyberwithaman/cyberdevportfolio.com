"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faEnvelope,
  faPhone,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import SocialIcons from "./Layout/SocialIcons";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Show success message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormState({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        setSubmitted(false);
      }, 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-zinc-900/50 border border-zinc-800/50 rounded-md text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm px-4 py-2.5";

  const labelClasses = "block text-sm font-medium mb-2 text-zinc-400";  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden" id="contact">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      <div className="nextjs-container relative z-10 py-32">
        <div className="text-center mb-20 relative">
          <div className="inline-block mb-6">
            <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-3 h-3 text-blue-400" />
              GET IN TOUCH
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-blue-100 to-purple-100 mb-6">
            Contact Me
          </h2>          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed">
            Ready to secure your digital future? Let&apos;s collaborate on innovative cybersecurity solutions 
            and cutting-edge AI research projects.
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mt-8"></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl backdrop-blur-sm shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden">
              {/* Contact Information */}
              <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 border-r border-zinc-700/50 p-8 lg:p-12">
                <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-100 mb-8">
                  Contact Information
                </h4>

                <div className="space-y-8 mb-12">
                  <a href="mailto:info@example.com" className="group flex items-start cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mr-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-blue-400 w-5 h-5 group-hover:text-blue-300 transition-colors"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-2 font-medium tracking-wider">Primary Email</h5>
                      <p className="text-zinc-300 font-medium group-hover:text-zinc-200 transition-colors">info@example.com</p>
                    </div>
                  </a>
                  <a href="mailto:example@gmail.com" className="group flex items-start cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mr-4 group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-emerald-400 w-5 h-5 group-hover:text-emerald-300 transition-colors"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-2 font-medium tracking-wider">Secure Email</h5>
                      <p className="text-zinc-300 font-medium group-hover:text-zinc-200 transition-colors">example@gmail.com</p>
                    </div>
                  </a>
                  <a href="tel:+911234567890" className="group flex items-start cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mr-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 group-hover:border-purple-500/50 transition-all duration-300 shadow-lg">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-purple-400 w-5 h-5 group-hover:text-purple-300 transition-colors"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-2 font-medium tracking-wider">Phone</h5>
                      <p className="text-zinc-300 font-medium group-hover:text-zinc-200 transition-colors">+91 1234567890</p>
                    </div>
                  </a>
                </div>

                <div>
                  <h5 className="text-xs uppercase text-zinc-500 mb-6 font-medium tracking-wider">Connect With Me</h5>
                  <SocialIcons />
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3 p-8 lg:p-12 bg-gradient-to-br from-zinc-900/30 to-zinc-800/30">
                <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-purple-100 mb-8">
                  Send a Message
                </h4>

                {submitted ? (
                  <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-8 text-center h-80 flex flex-col items-center justify-center backdrop-blur-sm shadow-xl">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mb-6 shadow-lg">
                      <FontAwesomeIcon icon={faPaperPlane} className="text-green-400 w-7 h-7" />
                    </div>
                    <h5 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-green-100 mb-4">Message Sent Successfully!</h5>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      Thank you for reaching out. I&apos;ll get back to you shortly with a secure response.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 mb-4 text-sm rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 text-red-400 border border-red-500/30 flex items-center backdrop-blur-sm">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-3 w-5 h-5" />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className={labelClasses}>Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          className={inputClasses}
                          placeholder="+1 (123) 456-7890"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className={labelClasses}>Subject</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="chief-information-security-officer">Chief Information Security Officer (CISO)</option>
                          <option value="cyber-intervention">Cyber Intervention</option>
                          <option value="penetration-tester">Penetration Tester (Ethical Hacker)</option>
                          <option value="cybercrime-investigator">Cybercrime Investigator</option>
                          <option value="cyber-defense-analyst">Cyber Defense Analyst</option>
                          <option value="cyber-warfare-analyst">Cyber Warfare Analyst</option>
                          <option value="ai-research-scientist">AI Research Scientist</option>
                          <option value="machine-learning-engineer">Machine Learning Engineer</option>
                          <option value="data-scientist">Data Scientist</option>
                          <option value="software-engineer">Software Engineer</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelClasses}>Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        rows={5}
                        className={inputClasses}
                        placeholder="How can I help you with your cybersecurity or AI project?"
                        required
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`group relative w-full py-4 px-6 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : ''}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        {loading ? (
                          <>
                            <span className="relative z-10 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span className="relative z-10">Processing Secure Message...</span>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Send Secure Message</span>
                          </>
                        )}
                      </button>

                      <p className="text-xs text-zinc-500 text-center mt-4 leading-relaxed">
                        🔒 Your message will be encrypted using military and enterprise-grade security protocols and handled with the utmost confidentiality.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;