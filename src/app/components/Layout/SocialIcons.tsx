"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGithub, 
  faLinkedin, 
  faInstagram,
  faWhatsapp,
  faFacebook
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SocialIconProps {
  href: string;
  icon: IconDefinition;
  label: string;
}

interface SocialLink {
  href: string;
  icon: IconDefinition;
  label: string;
}

const SocialIcon = ({ href, icon, label }: SocialIconProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="h-10 w-10 rounded-sm flex items-center justify-center cyberpunk-border neon-box hover:bg-[var(--primary)]/20 transition-all duration-300"
      aria-label={label}
    >
      <FontAwesomeIcon 
        icon={icon} 
        className="text-[var(--secondary)] text-lg hover:text-[var(--primary)] transition-colors duration-300" 
      />
    </a>
  );
};

const SocialIcons = () => {
  const socialLinks: SocialLink[] = [
    { href: "https://www.github.com/amananilofficial", icon: faGithub, label: "GitHub" },
    { href: "https://in.linkedin.com/in/amananilofficial", icon: faLinkedin, label: "LinkedIn" },
    { href: "https://www.instagram.com/amananilofficial", icon: faInstagram, label: "Instagram" },
    { href: "https://www.facebook.com/amananilofficial", icon: faFacebook, label: "Facebook" },
    { href: "https://wa.me/917892939127", icon: faWhatsapp, label: "WhatsApp" },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <SocialIcon
          key={link.label}
          href={link.href}
          icon={link.icon}
          label={link.label}
        />
      ))}
    </div>
  );
};

export default SocialIcons;
