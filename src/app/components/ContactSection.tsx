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

const ContactSection = () => {
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

  const labelClasses = "block text-sm font-medium mb-2 text-zinc-400";

  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden" id="contact">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="nextjs-container relative">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm font-medium mb-4">
            GET IN TOUCH
          </span>
          <h3 className="text-4xl font-bold text-zinc-100">
            Contact Us
          </h3>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            Ready to secure your digital future? Reach out to our team of cybersecurity experts today.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-5 rounded-lg overflow-hidden">
              {/* Contact Information */}
              <div className="lg:col-span-2 bg-zinc-900/50 border-r border-zinc-800/50 p-8 lg:p-12">
                <h4 className="text-xl font-medium mb-8 text-zinc-100">
                  Contact Information
                </h4>

                <div className="space-y-8 mb-12">
                  <a href="mailto:info@amananilofficial.com" className="flex items-start group cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-md bg-zinc-800/50 flex items-center justify-center mr-4 group-hover:bg-zinc-800/70 transition-colors duration-200">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-zinc-400 w-4 h-4"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-1">Email</h5>
                      <p className="text-zinc-300 font-medium">info@amananilofficial.com</p>
                    </div>
                  </a>
                  <a href="mailto:amananil.cyber@proton.me" className="flex items-start group cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-md bg-zinc-800/50 flex items-center justify-center mr-4 group-hover:bg-zinc-800/70 transition-colors duration-200">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-zinc-400 w-4 h-4"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-1">Email</h5>
                      <p className="text-zinc-300 font-medium">amananil.cyber@proton.me</p>
                    </div>
                  </a>
                  <a href="tel:+917892939127" className="flex items-start group cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <div className="w-10 h-10 rounded-md bg-zinc-800/50 flex items-center justify-center mr-4 group-hover:bg-zinc-800/70 transition-colors duration-200">
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="text-zinc-400 w-4 h-4"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs uppercase text-zinc-500 mb-1">Phone</h5>
                      <p className="text-zinc-300 font-medium">+91 7892939127</p>
                    </div>
                  </a>
                </div>

                <div>
                  <h5 className="text-xs uppercase text-zinc-500 mb-4">Connect With Us</h5>
                  <SocialIcons />
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3 p-8 lg:p-12 bg-zinc-900/30">
                <h4 className="text-xl font-medium mb-6 text-zinc-100">
                  Send a Message
                </h4>

                {submitted ? (
                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-md p-6 text-center h-80 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-md bg-zinc-800/50 flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faPaperPlane} className="text-zinc-400 w-5 h-5" />
                    </div>
                    <h5 className="text-lg font-medium text-zinc-100 mb-2">Message Sent!</h5>
                    <p className="text-zinc-500">
                      Thank you for reaching out. We&apos;ll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-4 mb-4 text-sm rounded-md bg-red-500/10 text-red-400 border border-red-500/20 flex items-center">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
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
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2 border border-zinc-800/50 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                      >
                        {loading ? (
                          <>
                            <span className="h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
                            Send Secure Message
                          </>
                        )}
                      </button>

                      <p className="text-xs text-zinc-500 text-center mt-4">
                        Your message will be encrypted using our secure protocols.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;