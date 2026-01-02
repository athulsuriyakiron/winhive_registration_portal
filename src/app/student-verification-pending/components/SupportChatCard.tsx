'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface SupportChatCardProps {
  faqs: FAQItem[];
  supportEmail: string;
  supportPhone: string;
}

const SupportChatCard = ({ faqs, supportEmail, supportPhone }: SupportChatCardProps) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showChatForm, setShowChatForm] = useState(false);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" className="text-secondary" />
        </div>
        <h2 className="font-heading font-bold text-xl text-text-primary">Need Help?</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-3">
            Frequently Asked Questions
          </h3>
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors duration-base"
              >
                <span className="font-heading font-medium text-sm text-text-primary pr-4">
                  {faq.question}
                </span>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  variant="outline"
                  className={`text-text-secondary flex-shrink-0 transition-transform duration-base ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 pt-2 bg-muted/50">
                  <p className="text-sm text-text-secondary">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-heading font-semibold text-sm text-text-primary mb-3">
            Contact Support
          </h3>
          <div className="space-y-3">
            <a
              href={`mailto:${supportEmail}`}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-base"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="EnvelopeIcon" size={16} variant="solid" className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Email Support</p>
                <p className="font-heading font-medium text-sm text-text-primary">{supportEmail}</p>
              </div>
            </a>

            <a
              href={`tel:${supportPhone}`}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-base"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="PhoneIcon" size={16} variant="solid" className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Phone Support</p>
                <p className="font-heading font-medium text-sm text-text-primary">{supportPhone}</p>
              </div>
            </a>

            <button
              onClick={() => setShowChatForm(!showChatForm)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-base shadow-sm"
            >
              <Icon name="ChatBubbleLeftEllipsisIcon" size={18} variant="solid" />
              <span className="font-heading font-semibold text-sm">Start Live Chat</span>
            </button>
          </div>
        </div>

        {showChatForm && (
          <div className="pt-4 border-t border-border">
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-semibold text-sm text-text-primary mb-1">
                    Chat Support Available
                  </p>
                  <p className="text-xs text-text-secondary">
                    Our support team is online Monday-Saturday, 9 AM - 6 PM IST. Average response time: 5 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatCard;