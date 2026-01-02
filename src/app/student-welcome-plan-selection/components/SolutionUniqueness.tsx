import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const SolutionUniqueness = () => {
  const features = [
  {
    icon: 'AcademicCapIcon',
    title: 'WET - Winhive Employability Test',
    description: 'Physical assessment conducted at Winhive locations or partner institutes to evaluate your job readiness across multiple dimensions including technical skills, communication, problem-solving, and workplace aptitude.',
    badge: 'Comprehensive',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ccd77fca-1766472029018.png",
    alt: 'Students taking Winhive Employability Test in modern assessment center'
  },
  {
    icon: 'UserGroupIcon',
    title: 'Exclusive Job Fairs',
    description: 'Direct access to 500+ hiring companies actively seeking fresh talent, with guaranteed interview opportunities.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1044b6383-1764663624525.png",
    alt: 'Professional job fair with recruiters interviewing candidates at modern exhibition hall'
  },
  {
    icon: 'ChatBubbleLeftRightIcon',
    title: 'Expert Talk Sessions',
    description: 'Weekly sessions with industry leaders, HR professionals, and successful alumni sharing insider placement strategies.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd6f7680-1766043581105.png",
    alt: 'Business expert giving presentation to engaged audience in modern conference room'
  },
  {
    icon: 'DocumentCheckIcon',
    title: 'Resume & Profile Building',
    description: 'Professional resume crafting, LinkedIn optimization, and portfolio development guided by placement experts.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19204142d-1764671823198.png",
    alt: 'Professional resume document with pen and coffee on wooden desk'
  },
  {
    icon: 'VideoCameraIcon',
    title: 'Mock Interview Training',
    description: 'Realistic interview simulations with detailed feedback from experienced recruiters to build confidence.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18127f02f-1764714866990.png",
    alt: 'Young professional woman in formal attire during video interview call on laptop'
  },
  {
    icon: 'ChartBarIcon',
    title: 'Placement Analytics',
    description: 'Real-time tracking of your application progress, interview performance, and personalized improvement recommendations.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd038983-1764655463888.png",
    alt: 'Business analytics dashboard showing colorful charts and graphs on computer screen'
  }];


  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
            Why Winhive is <span className="text-primary">Different</span>
          </h2>
          <p className="text-lg text-text-secondary">
            We're not just another job portal. We're your complete career transformation ecosystem designed specifically for freshers.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) =>
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-base border border-border group">
              <div className="relative h-48 overflow-hidden">
                <AppImage
                src={feature.image}
                alt={feature.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-base" />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                  <Icon name={feature.icon as any} size={24} variant="solid" className="text-primary" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-semibold text-xl text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default SolutionUniqueness;