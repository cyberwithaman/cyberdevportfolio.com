"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faServer, faCode, faLaptopCode, faPeopleGroup, faTerminal, faChartLine, faChalkboardTeacher, faTasks, faBug, faEye, faSearch, faLock, faNetworkWired, faUsers, faChess, faPenFancy, faRandom, faPuzzlePiece, faBrain, faExclamationTriangle, faUserTie, faComments, faFileWord, faFileCode, faDatabase, faChartBar, faTable, faFileAlt, faStickyNote, faPalette, faFilePowerpoint, faUser } from "@fortawesome/free-solid-svg-icons";
import { faDocker, faGithub, faJs, faRust } from "@fortawesome/free-brands-svg-icons";
import { faPython } from "@fortawesome/free-brands-svg-icons";

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Floating elements component
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating orbs */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-500/20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-60 right-1/3 w-5 h-5 bg-yellow-500/20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />

      {/* Gradient orbs with subtle movement */}
      <div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-xl animate-pulse"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-xl animate-pulse"
        style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
      />
    </div>
  );

  // Skills data structure
  const skills = {
    technical: [
      { name: "Network Engineering", icon: faNetworkWired },
      { name: "Penetration Testing", icon: faShieldHalved },
      { name: "Cryptography", icon: faLock },
      { name: "Digital Forensics", icon: faSearch },
      { name: "Threat Analysis", icon: faEye },
      { name: "Bug Bounty Hunting", icon: faBug },
      { name: "Software Engineering", icon: faCode },
      { name: "Artificial Intelligence", icon: faBrain },
      { name: "Data Science", icon: faChartLine },
      { name: "DevOps", icon: faServer },
    ],
    nonTechnical: [
      { name: "Project Management", icon: faTasks },
      { name: "Technical Writing", icon: faPenFancy },
      { name: "Team Leadership", icon: faUsers },
      { name: "Risk Assessment", icon: faExclamationTriangle },
      { name: "Security Training", icon: faChalkboardTeacher },
      { name: "Strategic Planning", icon: faChess },
      { name: "Leadership", icon: faUserTie },
      { name: "Communication", icon: faComments },
      { name: "Problem Solving", icon: faPuzzlePiece },
      { name: "Adaptability", icon: faRandom },
    ],
    coding: [
      { name: "Python", icon: faPython },
      { name: "TypeScript", icon: faJs },
      { name: "C", icon: faFileCode },
      { name: "Rust", icon: faRust },
      { name: "PostgreSQL", icon: faDatabase },
      { name: "MongoDB", icon: faDatabase },
      { name: "Redis", icon: faDatabase },
      { name: "SQLite", icon: faDatabase },
      { name: "Docker & Kubernetes", icon: faDocker },
      { name: "Git & GitHub", icon: faGithub },
    ],
    nonCoding: [
      { name: "Power BI", icon: faChartBar },
      { name: "MS Access", icon: faDatabase },
      { name: "Microsoft Excel", icon: faTable },
      { name: "Microsoft PowerPoint", icon: faFilePowerpoint },
      { name: "Microsoft Word", icon: faFileWord },
      { name: "Google Sheets", icon: faTable },
      { name: "Google Slides", icon: faFilePowerpoint },
      { name: "Google Docs", icon: faFileAlt },
      { name: "Notion", icon: faStickyNote },
      { name: "Figma", icon: faPalette }
    ]
  };

  // Background content
  const backgroundContent = {
    title: "My Background",
    paragraphs: [
      "I am an AI-SecOps Researcher & Scientist with expertise in penetration testing, cryptography, digital forensics, network engineering, and artificial intelligence. My research focuses on protecting sensitive data in AI systems while developing cutting-edge cybersecurity solutions.",
      "Currently pursuing a Master of Technology (M.Tech) in Computer Science & Engineering at IIT, with previous experience at top-tier tech companies including Google, Meta, and Amazon. I combine advanced academic research with real-world industry experience to tackle complex security challenges.",
      "As a passionate researcher who believes in 'Innovating Daily', I continuously push the boundaries of AI security, quantum cryptography, and automated threat detection while maintaining the highest standards of ethical hacking and responsible disclosure."
    ],
    image: "/about/me.jpg",
    imageAlt: "AI-SecOps Researcher & Scientist - Professional portrait"
  };

  // Skills categories
  const skillsCategories = [
    {
      title: "Technical Skills",
      icon: faLaptopCode,
      color: "text-[var(--primary)]",
      gradientFrom: "from-[var(--primary)]",
      gradientTo: "to-[var(--secondary)]",
      skills: skills.technical,
      delay: 0.1
    },
    {
      title: "Non-Technical Skills",
      icon: faPeopleGroup,
      color: "text-[var(--secondary)]",
      gradientFrom: "from-[var(--secondary)]",
      gradientTo: "to-[var(--accent)]",
      skills: skills.nonTechnical,
      delay: 0.2
    },
    {
      title: "Coding Skills",
      icon: faTerminal,
      color: "text-[var(--accent)]",
      gradientFrom: "from-[var(--accent)]",
      gradientTo: "to-[var(--primary)]",
      skills: skills.coding,
      delay: 0.3
    },
    {
      title: "Non-Coding Skills",
      icon: faChartLine,
      color: "text-[var(--primary)]",
      gradientFrom: "from-[var(--primary)]",
      gradientTo: "to-[var(--secondary)]",
      skills: skills.nonCoding,
      delay: 0.4
    }
  ];
  // Education content
  const educationContent = [
    {
      year: "2021 - 2025",
      title: "Master of Technology (M.Tech) in Computer Science & Engineering",
      institution: "Indian Institute of Technology (IIT)",
      description: "Currently pursuing advanced studies in computer science and engineering with specialization in cyber security and artificial intelligence.",
      delay: 0.3
    },
    {
      year: "2018 - 2021",
      title: "Bachelor of Technology (B.Tech) in Computer Science & Engineering",
      institution: "Indian Institute of Technology (IIT)",
      description: "Completed with 78.40% marks, focusing on computer science fundamentals, software engineering, and practical applications.",
      delay: 0.1
    }
  ];

  // Certifications content
  const certificationsContent = [
    {
      title: "Certified Ethical Hacker (CEH)",
      organization: "EC-Council",
      year: "2025",
      description: "Professional certification demonstrating expertise in penetration testing, vulnerability assessment, and ethical hacking methodologies.",
      delay: 0.2
    },
    {
      title: "Computer Hacking Forensic Investigator (CHFI)",
      organization: "EC-Council",
      year: "2025",
      description: "Specialized certification in digital forensics, evidence collection, and cyber crime investigation techniques.",
      delay: 0.4
    },
    {
      title: "Offensive Security Certified Professional (OSCP)",
      organization: "Offensive Security",
      year: "2025",
      description: "Hands-on certification validating practical penetration testing skills through rigorous 24-hour practical exam.",
      delay: 0.3
    },
    {
      title: "Certified Information Systems Security Professional (CISSP)",
      organization: "ISC²",
      year: "2025",
      description: "Gold standard certification covering security architecture, engineering, and management best practices.",
      delay: 0.1
    },
    {
      title: "Google Professional Machine Learning Engineer",
      organization: "Google",
      year: "2025",
      description: "Certification demonstrating expertise in designing, building, and deploying machine learning models on Google Cloud.",
      delay: 0.2
    },
    {
      title: "Google Professional Data Engineer",
      organization: "Google",
      year: "2025",
      description: "Certification validating skills in data processing systems and machine learning model deployment on GCP.",
      delay: 0.3
    },
    {
      title: "Google Data Analytics Professional",
      organization: "Google",
      year: "2025",
      description: "Certification covering data cleaning, analysis, visualization, and dashboard creation using Google tools.",
      delay: 0.4
    },
    {
      title: "Microsoft Certified: Power BI Data Analyst Associate",
      organization: "Microsoft",
      year: "2025",
      description: "Certification demonstrating proficiency in transforming data into actionable insights using Power BI.",
      delay: 0.5
    },
    {
      title: "Microsoft Certified: Azure AI Engineer Associate",
      organization: "Microsoft",
      year: "2025",
      description: "Certification demonstrating proficiency in building and deploying AI models using Azure AI services.",
      delay: 0.5
    },
    {
      title: "Microsoft Certified: Azure Data Scientist Associate",
      organization: "Microsoft",
      year: "2025",
      description: "Certification demonstrating proficiency in building and deploying data science solutions using Azure.",
      delay: 0.6
    }
  ];

  // Professional experience content
  const experienceContent = [
    {
      year: "2024 - Present",
      title: "Software Engineer",
      company: "Google",
      description: "Developing scalable distributed systems and machine learning infrastructure. Working on core search algorithms and data processing pipelines that serve billions of users globally. Implementing cutting-edge AI/ML solutions for search optimization and user experience enhancement.",
      delay: 0.1
    },
    {
      year: "2023 - 2024",
      title: "Senior Software Engineer",
      company: "Meta",
      description: "Built and maintained large-scale social media infrastructure and recommendation systems. Developed real-time data processing solutions for content delivery and user engagement. Worked on privacy-focused features and security implementations across multiple platforms.",
      delay: 0.2
    },
    {
      year: "2022 - 2023",
      title: "Cloud Solutions Architect",
      company: "Amazon",
      description: "Designed and implemented cloud infrastructure solutions for enterprise clients using AWS services. Led migration projects from on-premises to cloud environments. Specialized in security architecture, cost optimization, and scalable system design for high-traffic applications.",
      delay: 0.3
    }
  ];

  const [activeTab, setActiveTab] = useState(0);
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0f0f23] relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-[#0A0A0A] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-purple-900/5 pointer-events-none" />

      <FloatingElements />

      <div className="nextjs-container relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center relative">
          <div className="flex flex-col lg:flex-row items-center w-full">
            <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 pt-24 lg:pt-10">
              <div className="max-w-2xl">
                {/* Enhanced badge */}
                <div className="mb-12 relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <span className="relative inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                    Professional Portfolio
                  </span>
                </div>

                {/* Enhanced title */}
                <h1 className="text-5xl md:text-7xl font-bold mb-8 relative">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300 animate-gradient-x">
                    About Me
                  </span>
                  <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </h1>

                {/* Enhanced description */}
                <p className="text-zinc-400 mt-4 max-w-xl text-lg leading-relaxed relative z-10 backdrop-blur-sm">
                  AI-SecOps Researcher & Scientist specializing in quantum cryptography, penetration testing, and digital forensics. Currently pursuing M.Tech at IIT while developing cutting-edge cybersecurity solutions that protect sensitive AI systems and research data. Passionate about ethical hacking, automated threat detection, and advancing the intersection of artificial intelligence and cybersecurity through innovative research and practical implementations.
                </p>

                <div className="flex space-x-2 mt-8">
                  <div className="h-0.5 w-16 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <div className="h-0.5 w-8 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <div className="h-0.5 w-4 bg-gradient-to-r from-pink-600 to-red-600"></div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden h-[400px] lg:h-auto">
              <div className="relative w-[350px] h-[350px]">
                {/* Main quantum AI cybersecurity visualization */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-sm rounded-3xl border border-zinc-700/60 overflow-hidden shadow-2xl">
                  {/* Digital matrix background */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>

                  {/* Cybersecurity shield backdrop */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.08),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.08),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(147,51,234,0.08),transparent_60%)]"></div>

                  {/* AI neural network overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/6 via-blue-600/6 to-purple-600/6 animate-pulse"></div>

                  {/* Main quantum AI cybersecurity visualization */}
                  <div className="absolute inset-0 p-8">
                    {/* Central quantum AI core */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative w-24 h-24">
                        {/* Quantum sphere with AI glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/40 to-cyan-500/40 border-2 border-emerald-400/60 shadow-lg animate-pulse"></div>
                        {/* AI processing layer */}
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        {/* Security core */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-emerald-300/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                        
                        {/* AI processing indicators */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 bg-emerald-400/80 rounded-full animate-ping"
                            style={{
                              left: `${50 + 40 * Math.cos((i * 45) * Math.PI / 180)}%`,
                              top: `${50 + 40 * Math.sin((i * 45) * Math.PI / 180)}%`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quantum orbital security rings */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-40 h-40 rounded-full border-2 border-emerald-400/20 animate-spin" style={{ animationDuration: '15s' }}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-blue-400/15 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-purple-400/10 animate-spin" style={{ animationDuration: '25s' }}></div>
                    </div>
                    
                    {/* AI Neural network nodes */}
                    {[
                      { left: '67.3%', top: '50%', delay: '0s', type: 'ai' },
                      { left: '60.6%', top: '40%', delay: '0.1s', type: 'quantum' },
                      { left: '50%', top: '32.7%', delay: '0.2s', type: 'security' },
                      { left: '39.4%', top: '40%', delay: '0.3s', type: 'ai' },
                      { left: '32.7%', top: '50%', delay: '0.4s', type: 'quantum' },
                      { left: '39.4%', top: '60%', delay: '0.5s', type: 'security' },
                      { left: '50%', top: '67.3%', delay: '0.6s', type: 'ai' },
                      { left: '60.6%', top: '60%', delay: '0.7s', type: 'quantum' },
                      { left: '65%', top: '45%', delay: '0.8s', type: 'security' },
                      { left: '55%', top: '35%', delay: '0.9s', type: 'ai' },
                      { left: '45%', top: '35%', delay: '1s', type: 'quantum' },
                      { left: '35%', top: '45%', delay: '1.1s', type: 'security' }
                    ].map((particle, i) => (
                      <div
                        key={i}
                        className={`absolute w-1.5 h-1.5 rounded-full shadow-lg animate-pulse ${
                          particle.type === 'ai' ? 'bg-gradient-to-br from-emerald-400/80 to-green-400/80' :
                          particle.type === 'quantum' ? 'bg-gradient-to-br from-blue-400/80 to-cyan-400/80' :
                          'bg-gradient-to-br from-purple-400/80 to-pink-400/80'
                        }`}
                        style={{
                          left: particle.left,
                          top: particle.top,
                          animationDelay: particle.delay
                        }}
                      />
                    ))}

                    {/* Security perimeter nodes */}
                    <div className="absolute top-8 left-8">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-400/50 rounded-full animate-pulse">
                        <div className="absolute inset-1 bg-emerald-400/40 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-emerald-300/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-8 right-8">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-400/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}>
                        <div className="absolute inset-1 bg-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-300/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500/30 to-violet-500/30 border border-purple-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}>
                        <div className="absolute inset-1 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-300/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-8 right-8">
                      <div className="w-6 h-6 bg-gradient-to-br from-pink-500/30 to-rose-500/30 border border-pink-400/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}>
                        <div className="absolute inset-1 bg-pink-400/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-pink-300/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Quantum-AI data pathways */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="aiBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(34,197,94,0)" />
                          <stop offset="50%" stopColor="rgba(34,197,94,0.4)" />
                          <stop offset="100%" stopColor="rgba(34,197,94,0)" />
                        </linearGradient>
                        <linearGradient id="quantumBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                          <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
                          <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                        </linearGradient>
                        <linearGradient id="securityBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgba(147,51,234,0)" />
                          <stop offset="50%" stopColor="rgba(147,51,234,0.4)" />
                          <stop offset="100%" stopColor="rgba(147,51,234,0)" />
                        </linearGradient>
                      </defs>

                      {/* AI processing lines */}
                      <line x1="50" y1="50" x2="300" y2="50" stroke="url(#aiBeam)" strokeWidth="1" className="animate-pulse" />
                      <line x1="175" y1="300" x2="175" y2="50" stroke="url(#quantumBeam)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
                      
                      {/* Quantum entanglement lines */}
                      <line x1="50" y1="300" x2="300" y2="50" stroke="url(#securityBeam)" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '2s' }} />
                      <line x1="300" y1="300" x2="50" y2="50" stroke="rgba(236,72,153,0.3)" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '3s' }} />
                      
                      {/* Security perimeter connections */}
                      <circle cx="50" cy="50" r="20" stroke="rgba(34,197,94,0.2)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <circle cx="300" cy="50" r="20" stroke="rgba(59,130,246,0.2)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                      <circle cx="50" cy="300" r="20" stroke="rgba(147,51,234,0.2)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '2.5s' }} />
                      <circle cx="300" cy="300" r="20" stroke="rgba(236,72,153,0.2)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '3.5s' }} />
                    </svg>
                    
                    {/* AI data streams */}
                    {[
                      { left: '25%', top: '20%', rotation: '0deg', delay: '0s', color: 'emerald' },
                      { left: '45%', top: '80%', rotation: '45deg', delay: '0.5s', color: 'blue' },
                      { left: '65%', top: '60%', rotation: '90deg', delay: '1s', color: 'purple' },
                      { left: '85%', top: '40%', rotation: '135deg', delay: '1.5s', color: 'pink' }
                    ].map((stream, i) => (
                      <div
                        key={i}
                        className={`absolute w-px h-8 animate-pulse ${
                          stream.color === 'emerald' ? 'bg-gradient-to-b from-transparent via-emerald-400/60 to-transparent' :
                          stream.color === 'blue' ? 'bg-gradient-to-b from-transparent via-blue-400/60 to-transparent' :
                          stream.color === 'purple' ? 'bg-gradient-to-b from-transparent via-purple-400/60 to-transparent' :
                          'bg-gradient-to-b from-transparent via-pink-400/60 to-transparent'
                        }`}
                        style={{
                          left: stream.left,
                          top: stream.top,
                          animationDelay: stream.delay,
                          transform: `rotate(${stream.rotation})`
                        }}
                      />
                    ))}

                    {/* Quantum AI status indicators */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1">
                        <div className="w-0.5 h-3 bg-gradient-to-t from-emerald-400/40 to-green-400/40 animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-t from-blue-400/40 to-cyan-400/40 animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-t from-purple-400/40 to-violet-400/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-t from-pink-400/40 to-rose-400/40 animate-pulse" style={{ animationDelay: '0.3s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-t from-emerald-400/40 to-green-400/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-1">
                        <div className="w-0.5 h-3 bg-gradient-to-b from-cyan-400/40 to-blue-400/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-b from-violet-400/40 to-purple-400/40 animate-pulse" style={{ animationDelay: '0.6s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-b from-rose-400/40 to-pink-400/40 animate-pulse" style={{ animationDelay: '0.7s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-b from-green-400/40 to-emerald-400/40 animate-pulse" style={{ animationDelay: '0.8s' }} />
                        <div className="w-0.5 h-3 bg-gradient-to-b from-blue-400/40 to-cyan-400/40 animate-pulse" style={{ animationDelay: '0.9s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
        {/* Background Section */}
        <section className="py-32 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faUser} className="mr-2 w-3 h-3 text-blue-400" />
                MY STORY
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300 relative z-10">
              Background
              </span>
              <div className="absolute left-0 right-0 -bottom-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-70 w-32 mx-auto"></div>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            <div className="lg:w-1/2 relative">
              <div className="max-w-xl mx-auto lg:mx-0">
                <div className="space-y-8">
                  {backgroundContent.paragraphs.map((paragraph, index) => (
                    <div
                      key={index}
                      className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-blue-500/30 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-xl"></div>
                      <p className="text-zinc-300 text-base leading-relaxed pl-4">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="relative max-w-[400px] group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-zinc-900/90 backdrop-blur-sm p-2 rounded-2xl overflow-hidden border border-zinc-700/50 shadow-xl">
                  <Image
                    src={backgroundContent.image}
                    alt={backgroundContent.imageAlt}
                    width={400}
                    height={400}
                    className="rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Skills Section */}
        <section className="py-32 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faCode} className="mr-2 w-3 h-3 text-purple-400" />
                CORE EXPERTISE
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-purple-100 to-pink-100 mb-6">
              Skills Overview
            </h2>
            <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
              A comprehensive skill set spanning technical and non-technical domains, combining innovation with practical expertise.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative">
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
              {skillsCategories.map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 backdrop-blur-sm border ${activeTab === index
                    ? 'bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 text-zinc-100 border-zinc-700/50 shadow-xl'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 border-zinc-800/30 hover:border-zinc-700/50'
                    }`}
                  onClick={() => setActiveTab(index)}
                >
                  <FontAwesomeIcon
                    icon={category.icon}
                    className="mr-2 text-sm"
                  />
                  {category.title}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 shadow-xl">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800/50 to-zinc-700/50 border border-zinc-600/50 mr-4 shadow-lg">
                    <FontAwesomeIcon
                      icon={skillsCategories[activeTab].icon}
                      className="text-zinc-300 text-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-purple-100">
                    {skillsCategories[activeTab].title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillsCategories[activeTab].skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="group bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 backdrop-blur-sm hover:scale-105"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 mr-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                          <FontAwesomeIcon
                            icon={skill.icon}
                            className="text-purple-400 group-hover:text-purple-300 transition-colors text-sm"
                          />
                        </div>
                        <span className="text-zinc-300 text-sm font-medium group-hover:text-zinc-200 transition-colors">
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Education Section */}
        <section className="py-32 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faUser} className="mr-2 w-3 h-3 text-green-400" />
                LEARNING JOURNEY
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-green-100 to-emerald-100 mb-6">
              Education
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-600/30 via-zinc-500/20 to-green-600/30 hidden sm:block"></div>
            <div className="absolute left-4 sm:left-auto top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-600/30 via-zinc-500/20 to-green-600/30 sm:hidden"></div>

            {educationContent.map((item, index) => (
              <div key={index} className="relative mb-16 last:mb-0">
                {/* Desktop layout */}
                <div className={`hidden sm:flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-zinc-900 shadow-lg"></div>

                    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-green-500/30 transition-all duration-300">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-green-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mb-2">
                        {item.institution}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-md text-xs text-green-300 mb-3">
                        {item.year}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden flex items-start ml-12 relative">
                  <div className="absolute left-[-24px] top-2 w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border border-zinc-700"></div>

                  <div className="w-full">
                    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-green-500/30 transition-all duration-300">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-green-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mb-2">
                        {item.institution}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-md text-xs text-green-300 mb-3">
                        {item.year}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>        {/* Experience Section */}
        <section className="py-32 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faUsers} className="mr-2 w-3 h-3 text-orange-400" />
                PROFESSIONAL JOURNEY
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-orange-100 to-yellow-100 mb-6">
              Professional Experience
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-orange-600 to-yellow-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-600/30 via-zinc-500/20 to-orange-600/30 hidden sm:block"></div>
            <div className="absolute left-4 sm:left-auto top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-600/30 via-zinc-500/20 to-orange-600/30 sm:hidden"></div>

            {experienceContent.map((item, index) => (
              <div key={index} className="relative mb-16 last:mb-0">
                {/* Desktop layout */}
                <div className={`hidden sm:flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border-2 border-zinc-900 shadow-lg"></div>

                    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-orange-500/30 transition-all duration-300">
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-orange-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mb-2">
                        {item.company}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-md text-xs text-orange-300 mb-3">
                        {item.year}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden flex items-start ml-12 relative">
                  <div className="absolute left-[-24px] top-2 w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border border-zinc-700"></div>

                  <div className="w-full">
                    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-orange-500/30 transition-all duration-300">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-orange-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium mb-2">
                        {item.company}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-md text-xs text-orange-300 mb-3">
                        {item.year}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>        {/* Certifications Section */}
        <section className="py-32 relative">
          <div className="text-center mb-20 relative">
            <div className="inline-block mb-6">
              <span className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 text-zinc-300 text-sm font-medium backdrop-blur-sm shadow-xl">
                <FontAwesomeIcon icon={faCode} className="mr-2 w-3 h-3 text-cyan-400" />
                CERTIFICATIONS
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-cyan-100 to-blue-100 mb-6">
              Professional Certifications
            </h2>
            <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed mb-12">
              Continuous learning and certification in cutting-edge technologies and security practices.
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="relative pt-10">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-600/30 via-zinc-500/20 to-cyan-600/30"></div>

            <div className="overflow-x-auto hide-scrollbar pb-8">
              <div className="flex space-x-6 min-w-max px-4">
                {certificationsContent.map((cert, index) => (
                  <div
                    key={index}
                    className="w-[320px] flex-shrink-0 relative group"
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 border-2 border-zinc-900 shadow-lg"></div>
                    </div>

                    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-xl p-6 min-h-[250px] hover:border-cyan-500/50 transition-all duration-300 shadow-xl hover:shadow-cyan-500/20 backdrop-blur-sm hover:scale-105">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-cyan-100 mb-3 leading-tight">
                        {cert.title}
                      </h3>
                      <p className="text-cyan-400 text-sm font-medium mb-2">
                        {cert.organization}
                      </p>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-md text-xs text-cyan-300 mb-4">
                        {cert.year}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8 text-zinc-400 text-sm font-light">
              <span>← Scroll horizontally to see more certifications →</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}