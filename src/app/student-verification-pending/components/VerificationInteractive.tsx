'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { realtimeService } from '@/services/realtime.service';
import { studentService } from '@/services/student.service';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import VerificationStatusCard from './VerificationStatusCard';
import TimelineCard from './TimelineCard';
import DemoAccessCard from './DemoAccessCard';
import SupportChatCard from './SupportChatCard';
import SuccessStoriesCard from './SuccessStoriesCard';
import NextStepsCard from './NextStepsCard';

interface VerificationStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  estimatedTime: string;
}

interface DemoFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
  available: boolean;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface SuccessStory {
  id: number;
  name: string;
  college: string;
  company: string;
  package: string;
  image: string;
  alt: string;
  testimonial: string;
}

interface NextStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  actionable: boolean;
}

const VerificationInteractive = () => {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch initial verification status
    const loadVerificationStatus = async () => {
      try {
        const student = await studentService.getStudentByUserId(user.id);
        setVerificationStatus(student?.verificationStatus || 'pending');
      } catch (error) {
        console.error('Error loading verification status:', error);
      }
    };

    loadVerificationStatus();

    // Subscribe to real-time verification status updates
    const unsubscribe = realtimeService.subscribeToStudentVerification(
      user.id,
      (payload: RealtimePostgresChangesPayload<any>) => {
        if (payload.eventType === 'UPDATE') {
          const newStatus = payload?.new?.verification_status;
          const oldStatus = payload?.old?.verification_status;

          if (newStatus !== oldStatus) {
            setVerificationStatus(newStatus);
            
            // Show notification for status change
            let message = '';
            if (newStatus === 'verified') {
              message = '🎉 Congratulations! Your account has been verified. You now have full access to all features.';
            } else if (newStatus === 'rejected') {
              message = '❌ Your verification was not approved. Please contact support for more information.';
            } else if (newStatus === 'pending') {
              message = '⏳ Your verification status has been updated to pending review.';
            }

            if (message) {
              setNotificationMessage(message);
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 8000);
            }
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  const verificationStages: VerificationStage[] = [
  {
    id: 1,
    title: 'Application Received',
    description: 'Your registration has been successfully submitted and logged in our system.',
    status: 'completed',
    estimatedTime: 'Instant'
  },
  {
    id: 2,
    title: 'Document Verification',
    description: 'Our team is reviewing your academic documents and personal information for accuracy.',
    status: 'in-progress',
    estimatedTime: '2-3 business days'
  },
  {
    id: 3,
    title: 'Payment Confirmation',
    description: 'Verifying your premium membership payment and processing transaction details.',
    status: 'pending',
    estimatedTime: '1 business day'
  },
  {
    id: 4,
    title: 'Account Activation',
    description: 'Final setup of your premium account with full access to all platform features.',
    status: 'pending',
    estimatedTime: '1 business day'
  }];


  const demoFeatures: DemoFeature[] = [
  {
    id: 1,
    title: 'WET Practice Test',
    description: 'Try a sample Written Employability Test to understand the assessment format.',
    icon: 'DocumentTextIcon',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf0b3328-1765622026058.png",
    alt: 'Student taking online test on laptop with multiple choice questions visible on screen',
    available: true
  },
  {
    id: 2,
    title: 'Expert Talk Preview',
    description: 'Watch a recorded session from industry leaders sharing career insights.',
    icon: 'VideoCameraIcon',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd6f7680-1766043581105.png",
    alt: 'Professional speaker presenting to audience in modern conference room with presentation screen',
    available: true
  },
  {
    id: 3,
    title: 'Job Fair Highlights',
    description: 'Explore past job fair recordings and see how companies interact with candidates.',
    icon: 'BriefcaseIcon',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_139baaeb3-1764663625685.png",
    alt: 'Corporate job fair with recruiters at booths talking to job seekers in large exhibition hall',
    available: true
  },
  {
    id: 4,
    title: 'Resume Builder Tool',
    description: 'Access our AI-powered resume builder to create professional resumes.',
    icon: 'DocumentDuplicateIcon',
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
    alt: 'Professional resume document with clean layout and formatting on desk with pen',
    available: false
  }];


  const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'How long does verification typically take?',
    answer: 'Most verifications are completed within 3-5 business days. During peak admission seasons, it may take up to 7 business days. You\'ll receive email and SMS updates at each stage.'
  },
  {
    id: 2,
    question: 'What documents are being verified?',
    answer: 'We verify your college enrollment proof, academic transcripts, identity documents, and payment confirmation. All documents must be clear, valid, and match the information provided during registration.'
  },
  {
    id: 3,
    question: 'Can I access any features during verification?',
    answer: 'Yes! You have immediate access to demo content including sample WET tests, recorded expert talks, and job fair highlights. Full platform access will be granted once verification is complete.'
  },
  {
    id: 4,
    question: 'What if my verification is delayed?',
    answer: 'If verification exceeds the estimated timeline, our support team will proactively contact you. You can also reach out via email, phone, or live chat for status updates and assistance.'
  }];


  const successStories: SuccessStory[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    college: 'Delhi University',
    company: 'Infosys',
    package: '₹4.5 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f0883a0c-1763299171534.png",
    alt: 'Young Indian woman in professional blue blazer smiling confidently at camera in office setting',
    testimonial: 'Winhive\'s WET preparation and expert guidance helped me crack my dream job. The mock interviews were game-changers!'
  },
  {
    id: 2,
    name: 'Rahul Verma',
    college: 'Mumbai University',
    company: 'TCS',
    package: '₹3.8 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_17815c735-1766078495184.png",
    alt: 'Professional young man in formal white shirt with confident smile in modern office environment',
    testimonial: 'The job fair connections and resume building tools gave me the edge I needed. Placed within 2 months of graduation!'
  },
  {
    id: 3,
    name: 'Ananya Reddy',
    college: 'Bangalore Institute of Technology',
    company: 'Wipro',
    package: '₹5.2 LPA',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_124644cb0-1763295764731.png",
    alt: 'Confident young professional woman in black formal attire with warm smile in corporate setting',
    testimonial: 'From campus placement anxiety to confident professional - Winhive made the transition seamless with their structured approach.'
  }];


  const nextSteps: NextStep[] = [
  {
    id: 1,
    title: 'Check Your Email',
    description: 'We\'ve sent a confirmation email with your application reference number. Keep it safe for future correspondence.',
    icon: 'EnvelopeIcon',
    actionable: true
  },
  {
    id: 2,
    title: 'Explore Demo Content',
    description: 'While waiting, familiarize yourself with platform features through our demo content. This will help you hit the ground running once verified.',
    icon: 'PlayCircleIcon',
    actionable: true
  },
  {
    id: 3,
    title: 'Verification in Progress',
    description: 'Our team is reviewing your documents. You\'ll receive updates via email and SMS at each verification stage.',
    icon: 'ClockIcon',
    actionable: false
  },
  {
    id: 4,
    title: 'Account Activation',
    description: 'Once verified, you\'ll receive login credentials and a welcome email with platform orientation details.',
    icon: 'CheckBadgeIcon',
    actionable: false
  },
  {
    id: 5,
    title: 'Start Your Journey',
    description: 'Access full platform features, schedule your first WET test, and begin your placement preparation journey.',
    icon: 'RocketLaunchIcon',
    actionable: false
  }];


  const handleFeatureClick = (featureId: number) => {
    if (!isHydrated) return;
    const feature = demoFeatures.find((f) => f.id === featureId);
    if (feature?.available) {
      console.log(`Opening demo for: ${feature.title}`);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-32 bg-muted rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-96 bg-muted rounded-lg" />
                <div className="h-96 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Real-time Notification Banner */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4 animate-slide-down">
          <div className="bg-white rounded-lg shadow-xl border-l-4 border-accent p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{notificationMessage}</p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-text-secondary hover:text-text-primary"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/10 rounded-full mb-6">
              <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
              Registration Successful!
            </h1>
            <p className="text-base lg:text-lg text-text-secondary max-w-2xl mx-auto">
              Thank you for joining Winhive! Your application is being verified. We'll notify you once your account is activated.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <VerificationStatusCard stages={verificationStages} />
            <TimelineCard
              estimatedDays={5}
              notificationMethods={[
              'Email notifications to your registered email address',
              'SMS updates to your mobile number',
              'In-app notifications (once account is activated)']
              } />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <DemoAccessCard features={demoFeatures} onFeatureClick={handleFeatureClick} />
            <NextStepsCard steps={nextSteps} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SuccessStoriesCard stories={successStories} />
            <SupportChatCard
              faqs={faqs}
              supportEmail="support@winhive.in"
              supportPhone="+91-9876543210" />

          </div>

          <div className="mt-12 p-6 lg:p-8 bg-gradient-to-r from-primary to-secondary rounded-lg text-center">
            <h2 className="font-heading font-bold text-2xl text-white mb-3">
              Questions About Your Verification?
            </h2>
            <p className="text-white/90 text-sm mb-6 max-w-2xl mx-auto">
              Our support team is here to help. Reach out anytime via email, phone, or live chat for assistance with your application.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@winhive.in"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-primary font-heading font-semibold text-sm rounded-lg hover:bg-white/90 transition-all duration-base shadow-md">

                <span>Email Support</span>
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 text-white font-heading font-semibold text-sm rounded-lg hover:bg-white/20 transition-all duration-base border border-white/30">

                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default VerificationInteractive;