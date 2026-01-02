'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';


interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigationItems = [
    { label: 'Student Registration', href: '/student-welcome-plan-selection', icon: 'UserGroupIcon' },
    { label: 'College Portal', href: '/college-institution-overview', icon: 'AcademicCapIcon' },
    { label: 'Success Stories', href: '#success-stories', icon: 'StarIcon' },
    { label: 'Contact', href: '#contact', icon: 'PhoneIcon' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card shadow-md ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-base">
            <div className="relative w-auto h-10 lg:h-12">
              {!imageError ? (
                <Image
                  src="/assets/images/Winhive_1000_x_1000_px_-1766490007209.png"
                  alt="Winhive - Fresher's Placement Forum Logo"
                  width={120}
                  height={48}
                  className="h-10 lg:h-12 w-auto object-contain"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-10 lg:h-12 px-4 bg-primary text-primary-foreground font-bold text-lg rounded">
                  Winhive
                </div>
              )}
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-muted hover:text-primary transition-all duration-base"
              >
                <Icon name={item.icon as any} size={18} variant="outline" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/student-welcome-plan-selection"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded-md hover:bg-primary/90 transition-all duration-base shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-base"
            aria-label="Toggle mobile menu"
          >
            <Icon
              name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
              size={24}
              variant="outline"
            />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium text-text-primary hover:bg-muted hover:text-primary transition-all duration-base"
              >
                <Icon name={item.icon as any} size={20} variant="outline" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Link
                href="/student-welcome-plan-selection"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold text-base rounded-md hover:bg-primary/90 transition-all duration-base shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;