"use client";

import { useState } from 'react';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faServer, faCode, faLaptopCode, faPeopleGroup, faTerminal, faChartLine, faChalkboardTeacher, faTasks, faBug, faEye, faSearch, faLock, faNetworkWired, faUsers, faChess, faPenFancy, faRandom, faPuzzlePiece, faBrain, faExclamationTriangle, faUserTie, faComments, faFileWord, faFileCode, faDatabase, faChartBar, faTable, faFileAlt, faStickyNote, faPalette, faFilePowerpoint } from "@fortawesome/free-solid-svg-icons";
import { faDocker, faGithub, faJs, faRust } from "@fortawesome/free-brands-svg-icons";
import { faPython } from "@fortawesome/free-brands-svg-icons";

export default function AboutPage() {
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
      "I am an App Developer and SEO Specialist with expertise in Python, Django, Next.js, TypeScript, Flutter, MongoDB, PostgreSQL, Redis, and SQLite3. My interests span Data Science, Artificial Intelligence, Cyber Security, App Development, and Advanced Drone Technologies.",
      "Currently pursuing a Bachelor of Computer Applications in Cyber Security and Ethical Hacking, I previously completed a diploma in Computer Science & Engineering with a focus on Software Engineering. I blend technical knowledge with hands-on skills to create innovative solutions for complex problems.",
      "As a passionate technologist who believes in 'Innovating Daily', I continuously explore emerging technologies while prioritizing security best practices and efficient development approaches."
    ],
    image: "/about/me.jpg",
    imageAlt: "Professional portrait"
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
      year: "Present",
      title: "Bachelor of Computer Applications in Cyber Security and Ethical Hacking",
      institution: "Bangalore College of Management Studies, Bangalore - 560077",
      description: "Currently pursuing self-directed education in cyber security and ethical hacking concepts.",
      delay: 0.3
    },
    {
      year: "2021 - 2024",
      title: "Diploma of Education Computer Science",
      institution: "Al Khateeb Polytechnic College, Bangalore - 560094",
      description: "Completed with 78.40% marks, focusing on computer science fundamentals and practical applications.",
      delay: 0.1
    },
    {
      year: "2019 - 2020",
      title: "SSLC (Secondary School Leaving Certificate)",
      institution: "Preethi Dham English Medium High School, Bangalore - 560114",
      description: "Completed with 54.32% marks, establishing a foundation for further technical education.",
      delay: 0.2
    },
  ];

  // Certifications content
  const certificationsContent = [
    {
      title: "Certified Ethical Hacker (CEH)",
      organization: "EC-Council",
      year: "Going on",
      description: "Professional certification demonstrating expertise in penetration testing, vulnerability assessment, and ethical hacking methodologies.",
      delay: 0.2
    },
    {
      title: "Computer Hacking Forensic Investigator (CHFI)",
      organization: "EC-Council",
      year: "Going on",
      description: "Specialized certification in digital forensics, evidence collection, and cyber crime investigation techniques.",
      delay: 0.4
    },
    {
      title: "Offensive Security Certified Professional (OSCP)",
      organization: "Offensive Security",
      year: "Going on",
      description: "Hands-on certification validating practical penetration testing skills through rigorous 24-hour practical exam.",
      delay: 0.3
    },
    {
      title: "Certified Information Systems Security Professional (CISSP)",
      organization: "ISC²",
      year: "Going on",
      description: "Gold standard certification covering security architecture, engineering, and management best practices.",
      delay: 0.1
    },
    {
      title: "Google Professional Machine Learning Engineer",
      organization: "Google",
      year: "Going on",
      description: "Certification demonstrating expertise in designing, building, and deploying machine learning models on Google Cloud.",
      delay: 0.2
    },
    {
      title: "Google Professional Data Engineer",
      organization: "Google",
      year: "Going on",
      description: "Certification validating skills in data processing systems and machine learning model deployment on GCP.",
      delay: 0.3
    },
    {
      title: "Google Data Analytics Professional",
      organization: "Google",
      year: "Going on",
      description: "Certification covering data cleaning, analysis, visualization, and dashboard creation using Google tools.",
      delay: 0.4
    },
    {
      title: "Microsoft Certified: Power BI Data Analyst Associate",
      organization: "Microsoft",
      year: "Going on",
      description: "Certification demonstrating proficiency in transforming data into actionable insights using Power BI.",
      delay: 0.5
    },
    {
      title: "Microsoft Certified: Azure AI Engineer Associate",
      organization: "Microsoft",
      year: "Going on",
      description: "Certification demonstrating proficiency in building and deploying AI models using Azure AI services.",
      delay: 0.5
    },
    {
      title: "Microsoft Certified: Azure Data Scientist Associate",
      organization: "Microsoft",
      year: "Going on",
      description: "Certification demonstrating proficiency in building and deploying data science solutions using Azure.",
      delay: 0.6
    }
  ];

  // Professional experience content
  const experienceContent = [
    {
      year: "Oct 2024 - Present",
      title: "App Developer & SEO Specialist",
      company: "Lovosis Technology LLC",
      description: "Building scalable web and mobile applications with Python, Django, Next.js, Flutter. Implementing SEO strategies including URL crawling, data analysis, keyword optimization, and on-page/off-page techniques. Using AI and data science to analyze website structures, generate reports, and enhance search rankings.",
      delay: 0.1
    },
    {
      year: "Aug 2024 - Sep 2024",
      title: "Web Developer & SEO Manager",
      company: "Goodiebasket",
      description: "Developed and maintained eCommerce website while optimizing SEO for Google and social media platforms. Analyzed website structures, generated SEO reports, and implemented strategies to improve search rankings using data-driven insights to enhance online visibility and drive organic traffic.",
      delay: 0.2
    },
    {
      year: "Jan 2024 - Mar 2024",
      title: "Full Stack Developer",
      company: "ZetaCoding Innovative Solutions",
      description: "Interned for three months focusing on Django development. Built scalable web applications using Django, Next.js, MySQL and SQLite3. Collaborated with a team to develop innovative solutions, enhancing backend development, database management, and API integration skills.",
      delay: 0.3
    },
    {
      year: "Oct 2023 - Jan 2024",
      title: "Network Engineer",
      company: "Micro Silicon Technologies",
      description: "Maintained and optimized network infrastructure, ensuring seamless connectivity, and troubleshooting hardware issues. Responsible for network configuration, hardware installation, and system maintenance, contributing to the efficient operation of the company's technical environment.",
      delay: 0.4
    }
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="nextjs-container relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 pt-24 lg:pt-10">
            <div className="max-w-2xl">
              <div>
                <div className="relative inline-block">
                  <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
                    Professional Portfolio
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mt-4">
                  About Me
                </h1>
                <p className="text-zinc-400 mt-4 max-w-xl text-sm leading-relaxed">
                  AI-SecOps Researcher & Scientist with expertise in protecting sensitive research data
                </p>
                <div className="flex space-x-2 mt-8">
                  <div className="h-0.5 w-16 bg-zinc-800"></div>
                  <div className="h-0.5 w-8 bg-zinc-800"></div>
                  <div className="h-0.5 w-4 bg-zinc-800"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden h-[400px] lg:h-auto">
            <div className="relative w-[350px] h-[350px]">
              {/* Tech-inspired visualization */}
              <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Central circle */}
                    <div className="absolute inset-0 rounded-full bg-zinc-800/50 border border-zinc-700/50"></div>
                    {/* Static elements */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-4 h-4 bg-zinc-700/50 rounded-full border border-zinc-600/50"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: `rotate(${i * 60}deg) translateX(100px)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Section */}
        <section className="py-16 md:py-20 relative">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="lg:w-1/2 relative">
              <div className="max-w-xl">
                <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100 mb-8">
                  {backgroundContent.title}
                </h2>
                <div className="space-y-6">
                  {backgroundContent.paragraphs.map((paragraph, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-zinc-800"></div>
                      <p className="pl-6 text-zinc-400 text-sm leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <div className="relative max-w-[300px] sm:max-w-md">
                <div className="relative bg-zinc-900/50 backdrop-blur-sm p-1 rounded-xl overflow-hidden border border-zinc-800/50">
                  <Image
                    src={backgroundContent.image}
                    alt={backgroundContent.imageAlt}
                    width={400}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 md:py-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100">
              Skills Overview
            </h2>
            <div className="w-24 h-0.5 bg-zinc-800 mx-auto mt-4"></div>
          </div>

          <div className="relative">
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
              {skillsCategories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${activeTab === index
                    ? 'bg-zinc-900/50 text-zinc-100 border border-zinc-800/50'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
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
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800/50 mr-4">
                    <FontAwesomeIcon
                      icon={skillsCategories[activeTab].icon}
                      className="text-zinc-400 text-lg"
                    />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-100">
                    {skillsCategories[activeTab].title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skillsCategories[activeTab].skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="bg-zinc-900/30 border border-zinc-800/30 rounded-lg p-3 hover:bg-zinc-900/40 transition-colors duration-200"
                    >
                      <span className="text-zinc-300 text-sm flex items-center">
                        <FontAwesomeIcon
                          icon={skill.icon}
                          className="text-zinc-500 mr-3 text-sm"
                        />
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="py-16 md:py-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100">
              Education
            </h2>
            <div className="w-24 h-0.5 bg-zinc-800 mx-auto mt-4"></div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800/50 hidden sm:block"></div>
            <div className="absolute left-4 sm:left-auto top-0 bottom-0 w-0.5 bg-zinc-800/50 sm:hidden"></div>

            {educationContent.map((item, index) => (
              <div key={index} className="relative mb-16 last:mb-0">
                {/* Desktop layout */}
                <div className={`hidden sm:flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>

                    <h3 className="text-xl font-medium text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium mb-2">
                      {item.institution}
                    </p>
                    <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-xs text-zinc-400 mb-3">
                      {item.year}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden flex items-start ml-12 relative">
                  <div className="absolute left-[-24px] top-0 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700"></div>

                  <div className="w-full">
                    <h3 className="text-lg font-medium text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium mb-2">
                      {item.institution}
                    </p>
                    <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-xs text-zinc-400 mb-3">
                      {item.year}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16 md:py-20 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100">
              Professional Experience
            </h2>
            <div className="w-24 h-0.5 bg-zinc-800 mx-auto mt-4"></div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-800/50 hidden sm:block"></div>
            <div className="absolute left-4 sm:left-auto top-0 bottom-0 w-0.5 bg-zinc-800/50 sm:hidden"></div>

            {experienceContent.map((item, index) => (
              <div key={index} className="relative mb-16 last:mb-0">
                {/* Desktop layout */}
                <div className={`hidden sm:flex items-center ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700"></div>

                    <h3 className="text-xl font-medium text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium mb-2">
                      {item.company}
                    </p>
                    <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-xs text-zinc-400 mb-3">
                      {item.year}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="sm:hidden flex items-start ml-12 relative">
                  <div className="absolute left-[-24px] top-0 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700"></div>

                  <div className="w-full">
                    <h3 className="text-lg font-medium text-zinc-100 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-sm font-medium mb-2">
                      {item.company}
                    </p>
                    <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-xs text-zinc-400 mb-3">
                      {item.year}
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-16 md:py-20 pb-32 md:pb-40 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-zinc-100">
              Certifications
            </h2>
            <div className="w-24 h-0.5 bg-zinc-800 mx-auto mt-4"></div>
          </div>

          <div className="relative pt-10">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-800/50"></div>

            <div className="overflow-x-auto hide-scrollbar pb-8">
              <div className="flex space-x-4 min-w-max px-4">
                {certificationsContent.map((cert, index) => (
                  <div
                    key={index}
                    className="w-[280px] flex-shrink-0 relative group"
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700"></div>
                      <div className="w-px h-8 bg-zinc-800/50 mx-auto"></div>
                    </div>

                    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4 min-h-[200px] hover:bg-zinc-900/60 transition-colors duration-200">
                      <div className="inline-block px-3 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-md text-xs text-zinc-400 mb-3">
                        {cert.year}
                      </div>
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <h3 className="text-lg font-medium text-zinc-100 mb-2">
                            {cert.title}
                          </h3>
                          <p className="text-zinc-400 text-xs font-medium mb-3 flex items-center">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600 mr-2"></span>
                            {cert.organization}
                          </p>
                        </div>
                        <p className="text-zinc-400 text-xs line-clamp-3">
                          {cert.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-4 text-zinc-500 text-xs font-light">
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