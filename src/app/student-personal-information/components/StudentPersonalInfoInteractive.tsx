'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import FormProgress from './FormProgress';
import PersonalInfoForm from './PersonalInfoForm';
import TrustBadges from './TrustBadges';

import { trackStudentRegistrationStep, trackFormSubmit } from '@/lib/analytics-events';

const StudentPersonalInfoInteractive = () => {
  const router = useRouter();

  // State variables
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({/* your form state */});

  const fetchExistingData = async () => {
    // fetch logic if needed
  };

  const validateForm = () => {
    // validation logic
    return true; // or false if invalid
  };

  useEffect(() => {
    // Track registration step view
    trackStudentRegistrationStep({
      step: 'personal_info',
      completion_time: 0
    });
    
    fetchExistingData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form submission attempt
    const startTime = Date.now();
    
    try {
      if (!validateForm()) {
        trackFormSubmit({
          form_id: 'student_personal_info',
          form_name: 'Student Personal Information',
          success: false
        });
        return;
      }

      setSaving(true);
      
      // Your existing submission code
      // e.g., API call to save data
      // await savePersonalInfo(formData);

      const completionTime = Math.floor((Date.now() - startTime) / 1000);
      
      // Track successful submission
      trackStudentRegistrationStep({
        step: 'personal_info',
        completion_time: completionTime
      });
      
      trackFormSubmit({
        form_id: 'student_personal_info',
        form_name: 'Student Personal Information',
        success: true
      });

      router.push('/student-academic-details');
    } catch (error) {
      console.error('Error saving personal information:', error);
      
      // Track failed submission
      trackFormSubmit({
        form_id: 'student_personal_info',
        form_name: 'Student Personal Information',
        success: false
      });
      
      // your existing error handling code
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <FormProgress currentStep={2} totalSteps={6} />
        <form onSubmit={handleSubmit}>
          <PersonalInfoForm formData={formData} setFormData={setFormData} disabled={saving} />
          <button type="submit" disabled={saving}>
            Submit
          </button>
        </form>
        <TrustBadges />
      </div>
    </div>
  );
};

export default StudentPersonalInfoInteractive;