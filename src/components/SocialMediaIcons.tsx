import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';

export interface SocialLink {
  name: string;
  url: string;
}

interface SocialMediaIconsProps {
  socialLinks: SocialLink[];
}

const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'facebook':
      return <FaFacebookF />;
    case 'instagram':
      return <FaInstagram />;
    case 'twitter':
    case 'x':
      return <FaXTwitter />;
    case 'youtube':
      return <FaYoutube />;
    case 'tiktok':
      return <FaTiktok />;
    case 'whatsapp':
      return <FaWhatsapp />;
    default:
      return null;
  }
};

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ socialLinks }) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center space-x-4 py-4">
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-rumbera-blue transition-colors duration-200 text-2xl"
          aria-label={link.name}
        >
          {getIcon(link.name)}
        </Link>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
