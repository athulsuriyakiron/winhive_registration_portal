'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import HelpTooltip from './HelpTooltip';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  alternatePhone: string;
  guardianName: string;
  guardianPhone: string;
}

interface FormErrors {
  [key: string]: string;
}

const PersonalInfoForm = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    alternatePhone: '',
    guardianName: '',
    guardianPhone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setIsHydrated(true);
    const savedData = localStorage.getItem('studentPersonalInfo');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
      
      case 'phone': case'alternatePhone': case'guardianPhone':
        if (name === 'phone' && !value.trim()) return 'Phone number is required';
        if (value && !/^[6-9]\d{9}$/.test(value)) return 'Invalid Indian phone number';
        return '';
      
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 17 || age > 35) return 'Age must be between 17 and 35 years';
        return '';
      
      case 'gender':
        if (!value) return 'Gender is required';
        return '';
      
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please provide complete address';
        return '';
      
      case 'city':
        if (!value.trim()) return 'City is required';
        return '';
      
      case 'state':
        if (!value) return 'State is required';
        return '';
      
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^\d{6}$/.test(value)) return 'Invalid pincode format';
        return '';
      
      case 'guardianName':
        if (!value.trim()) return 'Guardian name is required';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'alternatePhone') {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    setIsSaving(true);
    localStorage.setItem('studentPersonalInfo', JSON.stringify(formData));
    
    setTimeout(() => {
      setIsSaving(false);
      router.push('/student-academic-details');
    }, 1000);
  };

  const handleBack = () => {
    router.push('/student-welcome-plan-selection');
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-md p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">Personal Information</h2>
        <p className="text-sm text-text-secondary">
          Please provide accurate information for verification purposes. All fields marked with * are mandatory.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Full Name *</span>
              <HelpTooltip content="Enter your full name as per official documents (Aadhaar, PAN, etc.)" />
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.fullName && touched.fullName ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="Enter your full name"
            />
            {errors.fullName && touched.fullName && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Email Address *</span>
              <HelpTooltip content="Use a valid email for all communication and login credentials" />
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.email && touched.email ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="your.email@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Phone Number *</span>
              <HelpTooltip content="10-digit mobile number for OTP verification and updates" />
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.phone && touched.phone ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="9876543210"
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Date of Birth *</span>
              <HelpTooltip content="Must be between 17-35 years for fresher eligibility" />
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 17)).toISOString().split('T')[0]}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.dateOfBirth && touched.dateOfBirth ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
            />
            {errors.dateOfBirth && touched.dateOfBirth && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.dateOfBirth}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Gender *</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.gender && touched.gender ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {errors.gender && touched.gender && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.gender}</span>
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Residential Address *</span>
              <HelpTooltip content="Complete address for document verification and communication" />
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.address && touched.address ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none`}
              placeholder="House/Flat No., Street, Locality"
            />
            {errors.address && touched.address && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.address}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="text-sm font-medium text-text-primary mb-2 block">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.city && touched.city ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="Enter city"
            />
            {errors.city && touched.city && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="text-sm font-medium text-text-primary mb-2 block">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.state && touched.state ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
            >
              <option value="">Select State</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && touched.state && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.state}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="pincode" className="text-sm font-medium text-text-primary mb-2 block">
              Pincode *
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={6}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.pincode && touched.pincode ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="400001"
            />
            {errors.pincode && touched.pincode && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.pincode}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="alternatePhone" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Alternate Phone</span>
              <span className="text-xs text-text-secondary">(Optional)</span>
            </label>
            <input
              type="tel"
              id="alternatePhone"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.alternatePhone && touched.alternatePhone ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="9876543210"
            />
            {errors.alternatePhone && touched.alternatePhone && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.alternatePhone}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="guardianName" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Guardian Name *</span>
              <HelpTooltip content="Parent or legal guardian name for emergency contact" />
            </label>
            <input
              type="text"
              id="guardianName"
              name="guardianName"
              value={formData.guardianName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.guardianName && touched.guardianName ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="Enter guardian name"
            />
            {errors.guardianName && touched.guardianName && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.guardianName}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="guardianPhone" className="flex items-center space-x-2 text-sm font-medium text-text-primary mb-2">
              <span>Guardian Phone *</span>
            </label>
            <input
              type="tel"
              id="guardianPhone"
              name="guardianPhone"
              value={formData.guardianPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-md border ${
                errors.guardianPhone && touched.guardianPhone ? 'border-error' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200`}
              placeholder="9876543210"
            />
            {errors.guardianPhone && touched.guardianPhone && (
              <p className="mt-1 text-xs text-error flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.guardianPhone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Why do we need this information?</p>
            <p>Your personal details help us verify your identity, ensure secure account access, and maintain communication throughout your placement journey. All information is encrypted and stored securely.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-6 py-3 border-2 border-primary text-primary font-heading font-semibold rounded-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowLeftIcon" size={20} variant="outline" />
            <span>Back</span>
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Continue to Academic Details</span>
                <Icon name="ArrowRightIcon" size={20} variant="outline" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;