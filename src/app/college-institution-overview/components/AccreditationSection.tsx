import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Accreditation {
  name: string;
  logo: string;
  logoAlt: string;
  description: string;
}

const AccreditationSection = () => {
  const accreditations: Accreditation[] = [
  {
    name: 'AICTE Approved',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1786f47aa-1764661930712.png",
    logoAlt: 'AICTE official circular logo with blue and orange colors featuring government emblem',
    description: 'All India Council for Technical Education recognition'
  },
  {
    name: 'UGC Recognized',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1162092ec-1766131133602.png",
    logoAlt: 'UGC official shield logo with maroon and gold colors featuring university seal',
    description: 'University Grants Commission certified platform'
  },
  {
    name: 'NAAC Accredited',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1b6056f44-1766423109517.png",
    logoAlt: 'NAAC official logo with green and blue colors featuring assessment emblem',
    description: 'National Assessment and Accreditation Council approved'
  },
  {
    name: 'ISO 9001:2015',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_16f93181e-1764655705959.png",
    logoAlt: 'ISO certification badge with blue and white colors featuring quality management symbol',
    description: 'International quality management standards certified'
  }];


  const verificationSteps = [
  {
    icon: 'DocumentTextIcon',
    title: 'Submit Documentation',
    description: 'Provide institutional accreditation certificates and registration details'
  },
  {
    icon: 'MagnifyingGlassIcon',
    title: 'Verification Process',
    description: 'Our team validates credentials through government education databases'
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Approval & Onboarding',
    description: 'Receive partnership confirmation and access to institutional dashboard'
  }];


  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Accreditation & Verification
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We partner exclusively with accredited institutions to maintain quality standards and ensure student success
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {accreditations.map((accreditation, index) =>
          <div
            key={index}
            className="bg-card rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-base border border-border">

              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20">
                <AppImage
                src={accreditation.logo}
                alt={accreditation.logoAlt}
                className="w-full h-full object-cover" />

              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {accreditation.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {accreditation.description}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-card rounded-xl shadow-lg p-8 lg:p-12 border border-border">
          <h3 className="font-heading font-bold text-2xl text-foreground text-center mb-12">
            Institutional Verification Process
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {verificationSteps.map((step, index) =>
            <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center relative">
                    <Icon name={step.icon as any} size={32} variant="solid" className="text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-heading font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h4 className="font-heading font-semibold text-lg text-foreground">
                    {step.title}
                  </h4>
                  
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                {index < verificationSteps.length - 1 &&
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <Icon name="ChevronRightIcon" size={20} variant="solid" className="text-primary" />
                    </div>
                  </div>
              }
              </div>
            )}
          </div>
          
          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-4">
              <Icon name="InformationCircleIcon" size={24} variant="solid" className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-heading font-semibold text-foreground mb-2">
                  Required Documentation
                </h5>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Please prepare your institution's AICTE/UGC approval letter, NAAC accreditation certificate, institutional registration documents, and authorized signatory details for the verification process. All documents will be securely stored and verified through official government databases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default AccreditationSection;