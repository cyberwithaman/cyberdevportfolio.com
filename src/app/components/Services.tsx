"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faShieldHalved,
  faMagnifyingGlass,
  faServer,
  faBrain,
  faCode,
  faUserSecret,
  faNetworkWired,
  faUserShield,
  faChartLine,
  faFlask
} from "@fortawesome/free-solid-svg-icons";

interface ServiceDetailProps {
  title: string;
  description: string;
  icon: IconDefinition;
  details: {
    expertise: string[];
    tools: string[];
    benefits: string[];
  };
}

const ServiceDetail = ({ title, description, icon, details }: ServiceDetailProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceTitle: title,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.message
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to submit service request. Please try again.';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          console.error('Response was not valid JSON:', errorText);
          errorMessage = 'Server returned an unexpected response format';
        }
        
        setSubmitStatus({
          success: false,
          message: errorMessage
        });
        setIsSubmitting(false);
        return;
      }
      
      let data;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse JSON response', error);
        setSubmitStatus({
          success: false,
          message: 'Server returned an invalid response'
        });
        setIsSubmitting(false);
        return;
      }

      setSubmitStatus({
        success: true,
        message: data.message || 'Service request submitted successfully!'
      });
      
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting service request:', error);
      setSubmitStatus({
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div
        className="border border-zinc-800/50 bg-zinc-900/50 hover:bg-zinc-900/60 rounded-lg p-4 cursor-pointer transition-all duration-200 h-full flex flex-col items-center text-center group backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 mb-3 group-hover:bg-zinc-800/70 transition-colors">
          <FontAwesomeIcon
            icon={icon}
            className="h-5 w-5 text-zinc-400 group-hover:text-zinc-300 transition-colors"
          />
        </div>
        <h3 className="text-base font-medium text-zinc-100 group-hover:text-zinc-50 transition-colors">{title}</h3>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-zinc-900/50 backdrop-blur-sm rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-zinc-800/50">
              <div className="px-8 py-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                      <FontAwesomeIcon
                        icon={icon}
                        className="h-5 w-5 text-zinc-400"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-zinc-100">{title}</h3>
                      <p className="mt-1 text-zinc-400 text-sm">{description}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="bg-zinc-800/50 rounded-lg p-2 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/70 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  <div className="space-y-4">
                    <h4 className="text-zinc-100 font-medium text-sm uppercase tracking-wider">Expertise</h4>
                    <ul className="space-y-3">
                      {details.expertise.map((item, index) => (
                        <li key={index} className="text-zinc-400 text-sm flex items-start">
                          <span className="w-1 h-1 bg-zinc-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-zinc-100 font-medium text-sm uppercase tracking-wider">Tools & Technologies</h4>
                    <ul className="space-y-3">
                      {details.tools.map((item, index) => (
                        <li key={index} className="text-zinc-400 text-sm flex items-start">
                          <span className="w-1 h-1 bg-zinc-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-zinc-100 font-medium text-sm uppercase tracking-wider">Benefits</h4>
                    <ul className="space-y-3">
                      {details.benefits.map((item, index) => (
                        <li key={index} className="text-zinc-400 text-sm flex items-start">
                          <span className="w-1 h-1 bg-zinc-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowForm(!showForm);
                    }}
                    className="px-6 py-2 bg-zinc-900/50 text-zinc-100 text-sm font-medium rounded-lg border border-zinc-800/50 hover:bg-zinc-900/60 hover:text-zinc-50 transition-all"
                  >
                    {showForm ? "Cancel Request" : "Request Service"}
                  </button>
                </div>

                {showForm && (
                  <div className="mt-8 p-8 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50" onClick={(e) => e.stopPropagation()}>
                    <h4 className="text-lg font-medium text-zinc-100 mb-8">Request {title} Service</h4>

                    {submitStatus && (
                      <div className={`mb-8 p-4 rounded-lg border ${
                        submitStatus.success
                          ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-100'
                          : 'bg-zinc-900/50 border-zinc-800/50 text-red-400'
                      }`}>
                        {submitStatus.message}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-400">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/20 text-zinc-100 text-sm transition-colors backdrop-blur-sm"
                          placeholder="Enter your full name"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/20 text-zinc-100 text-sm transition-colors backdrop-blur-sm"
                          placeholder="Enter your email address"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-zinc-400">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/20 text-zinc-100 text-sm transition-colors backdrop-blur-sm"
                          placeholder="Enter your phone number"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-400">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700/20 text-zinc-100 text-sm resize-none transition-colors backdrop-blur-sm"
                          placeholder="Describe your requirements"
                          disabled={isSubmitting}
                        ></textarea>
                      </div>

                      <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                          type="submit"
                          className="px-8 py-2 bg-zinc-900/50 text-zinc-100 font-medium rounded-lg border border-zinc-800/50 disabled:opacity-50 hover:bg-zinc-900/60 hover:text-zinc-50 transition-all"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Request"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Services = () => {
  const servicesDetails = [
    {
      title: "Chief Information Security Officer (CISO)",
      description: "Strategic leadership for organizational security with comprehensive risk management and security policy development.",
      icon: faUserShield,
      details: {
        expertise: [
          "Security strategy development",
          "Risk assessment and management",
          "Security governance",
          "Compliance management",
          "Security awareness programs"
        ],
        tools: [
          "GRC platforms",
          "Security frameworks (NIST, ISO 27001)",
          "Risk management tools",
          "Security metrics dashboards",
          "Policy management systems"
        ],
        benefits: [
          "Reduced security incidents",
          "Regulatory compliance",
          "Improved security posture",
          "Strategic security roadmap",
          "Executive-level security guidance"
        ]
      }
    },
    {
      title: "Cyber Intelligence Analyst",
      description: "Analyze and interpret complex cyber security data to provide actionable intelligence for decision-making.",
      icon: faChartLine,
      details: {
        expertise: [
          "Threat intelligence analysis",
          "Malware analysis and reverse engineering", 
          "Dark web monitoring and analysis",
          "Cyber threat hunting",
          "Intelligence reporting and briefing"
        ],
        tools: [
          "Maltego",
          "VirusTotal",
          "IBM X-Force Exchange",
          "ThreatConnect",
          "Recorded Future"
        ],
        benefits: [
          "Early threat detection",
          "Proactive security measures",
          "Strategic threat intelligence",
          "Enhanced incident response",
          "Improved security decision-making"
        ]
      }
    },
    {
      title: "Penetration Tester (Ethical Hacker)",
      description: "Authorized security testing to identify and exploit vulnerabilities in systems before malicious actors can discover them.",
      icon: faUserSecret,
      details: {
        expertise: [
          "Network penetration testing",
          "Web application security testing",
          "Social engineering assessments",
          "Wireless network testing",
          "Physical security assessments"
        ],
        tools: [
          "Kali Linux",
          "Metasploit",
          "Burp Suite",
          "Nmap",
          "OWASP ZAP"
        ],
        benefits: [
          "Identification of security weaknesses",
          "Validation of security controls",
          "Prioritized remediation guidance",
          "Compliance with security requirements",
          "Reduced risk of successful attacks"
        ]
      }
    },
    {
      title: "Cybercrime Investigator",
      description: "Specialized investigation techniques to track digital criminal activities and gather electronic evidence for prosecution.",
      icon: faMagnifyingGlass,
      details: {
        expertise: [
          "Digital forensics",
          "Evidence collection and preservation",
          "Chain of custody management",
          "Incident response",
          "Legal testimony"
        ],
        tools: [
          "EnCase",
          "FTK (Forensic Toolkit)",
          "Cellebrite",
          "Wireshark",
          "Autopsy"
        ],
        benefits: [
          "Legally admissible evidence collection",
          "Attribution of attacks",
          "Recovery of compromised data",
          "Support for legal proceedings",
          "Detailed incident documentation"
        ]
      }
    },
    {
      title: "Cyber Defense Analyst",
      description: "Proactive monitoring and response to security incidents to protect critical infrastructure and sensitive data.",
      icon: faShieldHalved,
      details: {
        expertise: [
          "Security monitoring",
          "Threat hunting",
          "Incident response",
          "Malware analysis",
          "Security tool management"
        ],
        tools: [
          "SIEM solutions",
          "EDR/XDR platforms",
          "Threat intelligence platforms",
          "Network monitoring tools",
          "Sandbox environments"
        ],
        benefits: [
          "Reduced detection time",
          "Faster incident response",
          "Improved threat visibility",
          "Proactive threat hunting",
          "Enhanced security posture"
        ]
      }
    },
    {
      title: "Cyber Warfare Analyst",
      description: "Strategic analysis of cyber threats at a national security level with focus on advanced persistent threats.",
      icon: faNetworkWired,
      details: {
        expertise: [
          "APT detection and analysis",
          "Nation-state threat intelligence",
          "Strategic cyber defense planning",
          "Critical infrastructure protection",
          "Cyber threat attribution"
        ],
        tools: [
          "Threat intelligence platforms",
          "Advanced analytics systems",
          "Custom detection tools",
          "Malware reverse engineering tools",
          "Network traffic analysis systems"
        ],
        benefits: [
          "Early warning of sophisticated attacks",
          "Strategic defense planning",
          "Protection of critical assets",
          "Advanced threat detection",
          "Geopolitical threat context"
        ]
      }
    },
    {
      title: "AI Research Scientist",
      description: "Innovation in artificial intelligence algorithms with applications in security, pattern recognition, and threat detection.",
      icon: faBrain,
      details: {
        expertise: [
          "Machine learning algorithms",
          "Neural network design",
          "Natural language processing",
          "Computer vision",
          "Anomaly detection"
        ],
        tools: [
          "TensorFlow",
          "PyTorch",
          "Jupyter Notebooks",
          "CUDA",
          "Cloud ML platforms"
        ],
        benefits: [
          "Novel AI solutions for security challenges",
          "Automated threat detection",
          "Pattern recognition in large datasets",
          "Predictive security capabilities",
          "Research publications and IP development"
        ]
      }
    },
    {
      title: "Machine Learning Engineer",
      description: "Development of ML models that can predict, identify and respond to emerging security threats automatically.",
      icon: faServer,
      details: {
        expertise: [
          "ML model development",
          "Feature engineering",
          "Model training and validation",
          "ML operations (MLOps)",
          "Security-focused ML applications"
        ],
        tools: [
          "Scikit-learn",
          "Kubernetes",
          "MLflow",
          "Docker",
          "CI/CD pipelines"
        ],
        benefits: [
          "Automated threat detection",
          "Scalable ML solutions",
          "Reduced false positives",
          "Improved detection accuracy",
          "Operational efficiency"
        ]
      }
    },
    {
      title: "Data Scientist", 
      description: "Analysis of large security datasets to extract actionable intelligence and improve threat detection capabilities.",
      icon: faFlask,
      details: {
        expertise: [
          "Statistical analysis",
          "Data visualization",
          "Predictive modeling",
          "Big data processing",
          "Security data analysis"
        ],
        tools: [
          "Python (Pandas, NumPy)",
          "R",
          "Tableau/PowerBI",
          "Hadoop/Spark",
          "SQL/NoSQL databases"
        ],
        benefits: [
          "Data-driven security insights",
          "Advanced threat detection",
          "Security trend analysis",
          "Quantifiable security metrics",
          "Risk prediction models"
        ]
      }
    },
    {
      title: "Software Engineer",
      description: "Development of secure applications and systems with security-first design principles and robust testing.",
      icon: faCode,
      details: {
        expertise: [
          "Secure coding practices",
          "Application security",
          "DevSecOps implementation",
          "Security testing automation",
          "Code review and analysis"
        ],
        tools: [
          "Static code analyzers",
          "Dynamic application security testing",
          "Container security tools",
          "CI/CD security integration",
          "Dependency scanners"
        ],
        benefits: [
          "Secure software development",
          "Reduced security vulnerabilities",
          "Automated security testing",
          "Secure by design applications",
          "Compliance with security standards"
        ]
      }
    }
  ];

  return (
    <section className="py-24 bg-[#0A0A0A] relative" id="services-detail">
      {/* Subtle tech grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1 rounded-md bg-zinc-900/50 border border-zinc-800/50 text-zinc-400 text-sm font-medium mb-4">
            SERVICE CAPABILITIES
          </span>
          <h3 className="text-4xl font-bold text-zinc-100 mb-4">Service Details</h3>
          <div className="w-24 h-0.5 bg-zinc-800 mx-auto mt-4"></div>
          <p className="mt-8 max-w-2xl mx-auto text-zinc-400 text-base leading-relaxed">
            Click on each service to explore the expertise, tools, and benefits that I bring to the table. Each service is tailored to meet specific cybersecurity and technology needs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesDetails.map((service, index) => (
            <div key={index} className="flex">
              <ServiceDetail
                title={service.title}
                description={service.description}
                icon={service.icon}
                details={service.details}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;