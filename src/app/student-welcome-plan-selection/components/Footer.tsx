import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'For Students': [
      { label: 'Premium Membership', href: '/student-welcome-plan-selection' },
      { label: 'Success Stories', href: '#success-stories' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQs', href: '#faqs' }
    ],
    'For Colleges': [
      { label: 'Partnership Program', href: '/college-institution-overview' },
      { label: 'Bulk Registration', href: '/college-institution-overview' },
      { label: 'Benefits', href: '#benefits' },
      { label: 'Contact Sales', href: '#contact' }
    ],
    'Resources': [
      { label: 'Career Guides', href: '#resources' },
      { label: 'Interview Tips', href: '#resources' },
      { label: 'Resume Templates', href: '#resources' },
      { label: 'Blog', href: '#blog' }
    ],
    'Company': [
      { label: 'About Us', href: '#about' },
      { label: 'Contact', href: '#contact' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' }
    ]
  };

  const socialLinks = [
    { icon: 'EnvelopeIcon', href: '#', label: 'Email' },
    { icon: 'PhoneIcon', href: '#', label: 'Phone' },
    { icon: 'MapPinIcon', href: '#', label: 'Location' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <rect width="48" height="48" rx="8" fill="url(#footer-gradient)" />
                  <path
                    d="M12 18L18 30L24 18L30 30L36 18"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="24" cy="24" r="3" fill="white" />
                  <defs>
                    <linearGradient id="footer-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#1E40AF" />
                      <stop offset="1" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg text-primary">Winhive</span>
                <span className="text-xs text-text-secondary">Registration Portal</span>
              </div>
            </Link>
            <p className="text-sm text-text-secondary mb-4">
              India's first fresher-focused job placement ecosystem. Empowering students to transform uncertainty into career success.
            </p>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-base"
                  aria-label={social.label}
                >
                  <Icon name={social.icon as any} size={20} variant="outline" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-text-primary mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-primary transition-colors duration-base"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-text-secondary">
              © {currentYear} Winhive. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <Link href="#privacy" className="hover:text-primary transition-colors duration-base">
                Privacy Policy
              </Link>
              <Link href="#terms" className="hover:text-primary transition-colors duration-base">
                Terms of Service
              </Link>
              <Link href="#cookies" className="hover:text-primary transition-colors duration-base">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;