'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: number;
  name: string;
  college: string;
  company: string;
  package: string;
  image: string;
  alt: string;
  testimonial: string;
  beforeSalary: string;
  afterSalary: string;
}

const SocialProof = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    college: 'Delhi University',
    company: 'Infosys',
    package: '₹6.5 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f0883a0c-1763299171534.png",
    alt: 'Young Indian woman professional in blue blazer smiling confidently in modern office',
    testimonial: 'Winhive transformed my job search completely. The mock interviews and expert guidance helped me crack Infosys with a package I never thought possible as a fresher. The WET testing identified my weak areas, and the personalized training made all the difference.',
    beforeSalary: '₹3.5 LPA',
    afterSalary: '₹6.5 LPA'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    college: 'Mumbai University',
    company: 'TCS',
    package: '₹7.2 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_11e8a20a5-1765003605182.png",
    alt: 'Young professional man in formal shirt smiling at camera in corporate office setting',
    testimonial: 'I was struggling with interviews for months. Winhive\'s expert talk sessions and job fair access connected me directly with TCS recruiters. The resume building workshop made my profile stand out. Best investment I made for my career!',
    beforeSalary: '₹3.0 LPA',
    afterSalary: '₹7.2 LPA'
  },
  {
    id: 3,
    name: 'Anjali Patel',
    college: 'Pune University',
    company: 'Wipro',
    package: '₹6.8 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d436d25b-1763293622326.png",
    alt: 'Confident young woman in professional attire with laptop in bright modern workspace',
    testimonial: 'The placement analytics feature helped me track my progress and improve continuously. Within 3 months of joining Winhive, I had multiple offers. The community support and expert mentorship were invaluable during my placement journey.',
    beforeSalary: '₹3.2 LPA',
    afterSalary: '₹6.8 LPA'
  }];


  const stats = [
  { value: '2,500+', label: 'Students Placed', icon: 'UserGroupIcon' },
  { value: '100+', label: 'Partner Companies', icon: 'BuildingOfficeIcon' },
  { value: '95%', label: 'Success Rate', icon: 'CheckBadgeIcon' },
  { value: '₹4.5L', label: 'Average Package', icon: 'CurrencyRupeeIcon' }];


  const companyLogos = [
  { name: 'TCS', icon: 'BuildingOfficeIcon' },
  { name: 'Infosys', icon: 'BuildingOfficeIcon' },
  { name: 'Wipro', icon: 'BuildingOfficeIcon' },
  { name: 'Cognizant', icon: 'BuildingOfficeIcon' },
  { name: 'Accenture', icon: 'BuildingOfficeIcon' },
  { name: 'HCL', icon: 'BuildingOfficeIcon' }];


  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
            Join Thousands Who <span className="text-success">Transformed</span> Their Careers
          </h2>
          <p className="text-lg text-text-secondary">
            Real stories from real students who landed their dream jobs with Winhive
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {stats.map((stat, index) =>
          <div key={index} className="bg-card rounded-lg p-6 shadow-md text-center border border-border">
              <Icon name={stat.icon as any} size={32} variant="solid" className="text-primary mx-auto mb-3" />
              <div className="font-heading font-bold text-3xl text-text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-xl shadow-xl overflow-hidden border border-border">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 bg-gradient-to-br from-primary to-brand-trust p-8 flex flex-col items-center justify-center text-white">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <AppImage
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].alt}
                    className="w-full h-full object-cover" />

                </div>
                <h3 className="font-heading font-bold text-xl mb-1">{testimonials[activeTestimonial].name}</h3>
                <p className="text-sm text-white/80 mb-4">{testimonials[activeTestimonial].college}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-2">
                  <div className="text-xs text-white/80 mb-1">Placed at</div>
                  <div className="font-heading font-bold text-lg">{testimonials[activeTestimonial].company}</div>
                </div>
                <div className="text-2xl font-heading font-bold text-accent">{testimonials[activeTestimonial].package}</div>
              </div>
              
              <div className="md:col-span-3 p-8">
                <div className="flex items-start space-x-2 mb-4">
                  <Icon name="ChatBubbleLeftIcon" size={24} variant="solid" className="text-primary flex-shrink-0" />
                  <p className="text-text-primary leading-relaxed">
                    "{testimonials[activeTestimonial].testimonial}"
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="bg-error/10 rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-1">Before Winhive</div>
                    <div className="font-heading font-bold text-xl text-error">{testimonials[activeTestimonial].beforeSalary}</div>
                  </div>
                  <div className="bg-success/10 rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-1">After Winhive</div>
                    <div className="font-heading font-bold text-xl text-success">{testimonials[activeTestimonial].afterSalary}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 p-4 bg-muted border-t border-border">
              {testimonials.map((_, index) =>
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-base ${
                activeTestimonial === index ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50'}`
                }
                aria-label={`View testimonial ${index + 1}`} />

              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading font-semibold text-xl text-text-primary text-center mb-6">
            Trusted by Students from 200+ Colleges & Placed in Top Companies
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {companyLogos.map((company, index) =>
            <div key={index} className="bg-card rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-border hover:shadow-md transition-shadow duration-base">
                <Icon name={company.icon as any} size={32} variant="outline" className="text-primary mb-2" />
                <span className="text-xs text-text-secondary font-medium">{company.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default SocialProof;