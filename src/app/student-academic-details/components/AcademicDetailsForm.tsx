'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';


interface College {
  id: string;
  name: string;
  location: string;
  type: string;
}

interface Course {
  id: string;
  name: string;
  degree: string;
  duration: string;
}

interface AcademicDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  preview: string;
}

interface AcademicDetailsFormProps {
  onNext: () => void;
  onBack: () => void;
}

const AcademicDetailsForm = ({ onNext, onBack }: AcademicDetailsFormProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedCourse, setCourse] = useState('');
  const [gradingSystem, setGradingSystem] = useState('percentage');
  const [academicScore, setAcademicScore] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [graduationMonth, setGraduationMonth] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [uploadedDocuments, setUploadedDocuments] = useState<AcademicDocument[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const colleges: College[] = [
    { id: '1', name: 'Indian Institute of Technology, Delhi', location: 'New Delhi', type: 'Government' },
    { id: '2', name: 'National Institute of Technology, Trichy', location: 'Tiruchirappalli', type: 'Government' },
    { id: '3', name: 'Birla Institute of Technology and Science, Pilani', location: 'Pilani', type: 'Private' },
    { id: '4', name: 'Vellore Institute of Technology', location: 'Vellore', type: 'Private' },
    { id: '5', name: 'Delhi Technological University', location: 'New Delhi', type: 'Government' },
    { id: '6', name: 'Manipal Institute of Technology', location: 'Manipal', type: 'Private' },
    { id: '7', name: 'SRM Institute of Science and Technology', location: 'Chennai', type: 'Private' },
    { id: '8', name: 'Anna University', location: 'Chennai', type: 'Government' },
  ];

  const coursesByCollege: Record<string, Course[]> = {
    '1': [
      { id: 'c1', name: 'Computer Science and Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c2', name: 'Electrical Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c3', name: 'Mechanical Engineering', degree: 'B.Tech', duration: '4 years' },
    ],
    '2': [
      { id: 'c4', name: 'Electronics and Communication Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c5', name: 'Civil Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c6', name: 'Information Technology', degree: 'B.Tech', duration: '4 years' },
    ],
    '3': [
      { id: 'c7', name: 'Computer Science', degree: 'B.E.', duration: '4 years' },
      { id: 'c8', name: 'Electronics and Instrumentation', degree: 'B.E.', duration: '4 years' },
      { id: 'c9', name: 'Chemical Engineering', degree: 'B.E.', duration: '4 years' },
    ],
    '4': [
      { id: 'c10', name: 'Computer Science and Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c11', name: 'Information Technology', degree: 'B.Tech', duration: '4 years' },
      { id: 'c12', name: 'Electronics and Communication', degree: 'B.Tech', duration: '4 years' },
    ],
    '5': [
      { id: 'c13', name: 'Software Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c14', name: 'Computer Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c15', name: 'Mechanical Engineering', degree: 'B.Tech', duration: '4 years' },
    ],
    '6': [
      { id: 'c16', name: 'Computer and Communication Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c17', name: 'Biotechnology', degree: 'B.Tech', duration: '4 years' },
      { id: 'c18', name: 'Aeronautical Engineering', degree: 'B.Tech', duration: '4 years' },
    ],
    '7': [
      { id: 'c19', name: 'Computer Science and Engineering', degree: 'B.Tech', duration: '4 years' },
      { id: 'c20', name: 'Artificial Intelligence and Machine Learning', degree: 'B.Tech', duration: '4 years' },
      { id: 'c21', name: 'Data Science', degree: 'B.Tech', duration: '4 years' },
    ],
    '8': [
      { id: 'c22', name: 'Computer Science and Engineering', degree: 'B.E.', duration: '4 years' },
      { id: 'c23', name: 'Electronics and Communication Engineering', degree: 'B.E.', duration: '4 years' },
      { id: 'c24', name: 'Electrical and Electronics Engineering', degree: 'B.E.', duration: '4 years' },
    ],
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = isHydrated ? new Date().getFullYear() : 2025;
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const availableCourses = selectedCollege ? coursesByCollege[selectedCollege] || [] : [];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedCollege) newErrors.college = 'Please select your college';
      if (!selectedCourse) newErrors.course = 'Please select your course';
      if (!currentSemester) newErrors.semester = 'Please select your current semester';
    }

    if (step === 2) {
      if (!gradingSystem) newErrors.gradingSystem = 'Please select grading system';
      if (!academicScore) {
        newErrors.academicScore = 'Please enter your academic score';
      } else {
        const score = parseFloat(academicScore);
        if (gradingSystem === 'percentage' && (score < 0 || score > 100)) {
          newErrors.academicScore = 'Percentage must be between 0 and 100';
        } else if (gradingSystem === 'cgpa' && (score < 0 || score > 10)) {
          newErrors.academicScore = 'CGPA must be between 0 and 10';
        } else if (gradingSystem === 'gpa' && (score < 0 || score > 4)) {
          newErrors.academicScore = 'GPA must be between 0 and 4';
        }
      }
      if (!graduationYear) newErrors.graduationYear = 'Please select graduation year';
      if (!graduationMonth) newErrors.graduationMonth = 'Please select graduation month';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep(1)) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep(2)) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: AcademicDocument[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit`);
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} has invalid format. Only PDF, JPG, PNG allowed`);
        return;
      }

      newDocuments.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
      });
    });

    setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const calculateEquivalent = (): string => {
    if (!academicScore) return '';
    const score = parseFloat(academicScore);

    if (gradingSystem === 'percentage') {
      return `CGPA: ${(score / 9.5).toFixed(2)} | GPA: ${(score / 25).toFixed(2)}`;
    } else if (gradingSystem === 'cgpa') {
      return `Percentage: ${(score * 9.5).toFixed(1)}% | GPA: ${(score / 2.5).toFixed(2)}`;
    } else if (gradingSystem === 'gpa') {
      return `Percentage: ${(score * 25).toFixed(1)}% | CGPA: ${(score * 2.5).toFixed(2)}`;
    }
    return '';
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-lg shadow-md p-6 lg:p-8 mb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-base ${
                    currentStep === step
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : currentStep > step
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-text-secondary'
                  }`}
                >
                  {currentStep > step ? (
                    <Icon name="CheckIcon" size={20} variant="solid" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 lg:w-20 h-1 mx-2 transition-all duration-base ${
                      currentStep > step ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
            {currentStep === 1 && 'College & Course Information'}
            {currentStep === 2 && 'Academic Performance'}
            {currentStep === 3 && 'Document Upload'}
          </h2>
          <p className="text-text-secondary">
            {currentStep === 1 && 'Select your institution and program details'}
            {currentStep === 2 && 'Provide your academic scores and graduation timeline'}
            {currentStep === 3 && 'Upload supporting academic documents (optional)'}
          </p>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                College/University <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCollege}
                  onChange={(e) => {
                    setSelectedCollege(e.target.value);
                    setCourse('');
                    setErrors({ ...errors, college: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none ${
                    errors.college ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">Select your college</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name} - {college.location} ({college.type})
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
              {errors.college && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                  {errors.college}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Course/Program <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setCourse(e.target.value);
                    setErrors({ ...errors, course: '' });
                  }}
                  disabled={!selectedCollege}
                  className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.course ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">
                    {selectedCollege ? 'Select your course' : 'First select a college'}
                  </option>
                  {availableCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.degree}) - {course.duration}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
              {errors.course && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                  {errors.course}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current Semester <span className="text-error">*</span>
              </label>
              <div className="relative">
                <select
                  value={currentSemester}
                  onChange={(e) => {
                    setCurrentSemester(e.target.value);
                    setErrors({ ...errors, semester: '' });
                  }}
                  className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none ${
                    errors.semester ? 'border-error' : 'border-border'
                  }`}
                >
                  <option value="">Select current semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
              {errors.semester && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                  {errors.semester}
                </p>
              )}
            </div>

            <div className="bg-muted rounded-md p-4 flex items-start space-x-3">
              <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                We validate your college and course information with our institutional partnership database to ensure accurate placement matching.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Grading System <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'percentage', label: 'Percentage', icon: 'CalculatorIcon' },
                  { value: 'cgpa', label: 'CGPA (10)', icon: 'AcademicCapIcon' },
                  { value: 'gpa', label: 'GPA (4)', icon: 'ChartBarIcon' },
                ].map((system) => (
                  <button
                    key={system.value}
                    type="button"
                    onClick={() => {
                      setGradingSystem(system.value);
                      setAcademicScore('');
                      setErrors({ ...errors, gradingSystem: '' });
                    }}
                    className={`p-4 border-2 rounded-md flex flex-col items-center justify-center space-y-2 transition-all duration-base ${
                      gradingSystem === system.value
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon
                      name={system.icon as any}
                      size={24}
                      className={gradingSystem === system.value ? 'text-primary' : 'text-text-secondary'}
                    />
                    <span
                      className={`text-sm font-medium ${
                        gradingSystem === system.value ? 'text-primary' : 'text-text-primary'
                      }`}
                    >
                      {system.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.gradingSystem && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                  {errors.gradingSystem}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Academic Score <span className="text-error">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={academicScore}
                onChange={(e) => {
                  setAcademicScore(e.target.value);
                  setErrors({ ...errors, academicScore: '' });
                }}
                placeholder={
                  gradingSystem === 'percentage' ?'Enter percentage (0-100)'
                    : gradingSystem === 'cgpa' ?'Enter CGPA (0-10)' :'Enter GPA (0-4)'
                }
                className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.academicScore ? 'border-error' : 'border-border'
                }`}
              />
              {errors.academicScore && (
                <p className="text-error text-sm mt-1 flex items-center">
                  <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                  {errors.academicScore}
                </p>
              )}
              {academicScore && !errors.academicScore && (
                <div className="mt-2 p-3 bg-success/10 border border-success/20 rounded-md">
                  <p className="text-sm text-success font-medium">Equivalent Scores:</p>
                  <p className="text-sm text-text-secondary mt-1">{calculateEquivalent()}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Expected Graduation Month <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={graduationMonth}
                    onChange={(e) => {
                      setGraduationMonth(e.target.value);
                      setErrors({ ...errors, graduationMonth: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none ${
                      errors.graduationMonth ? 'border-error' : 'border-border'
                    }`}
                  >
                    <option value="">Select month</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="ChevronDownIcon"
                    size={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                  />
                </div>
                {errors.graduationMonth && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                    {errors.graduationMonth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Expected Graduation Year <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    value={graduationYear}
                    onChange={(e) => {
                      setGraduationYear(e.target.value);
                      setErrors({ ...errors, graduationYear: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none ${
                      errors.graduationYear ? 'border-error' : 'border-border'
                    }`}
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="ChevronDownIcon"
                    size={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                  />
                </div>
                {errors.graduationYear && (
                  <p className="text-error text-sm mt-1 flex items-center">
                    <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                    {errors.graduationYear}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Active Backlogs/Arrears
              </label>
              <div className="relative">
                <select
                  value={backlogs}
                  onChange={(e) => setBacklogs(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'backlog' : 'backlogs'}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDownIcon"
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Include only active backlogs. Cleared backlogs don't need to be reported.
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                id="document-upload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center space-y-3"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="CloudArrowUpIcon" size={32} className="text-primary" />
                </div>
                <div>
                  <p className="text-text-primary font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-text-secondary">
                    PDF, JPG, PNG up to 5MB each
                  </p>
                </div>
              </label>
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-text-primary">
                  Uploaded Documents ({uploadedDocuments.length})
                </h3>
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-md"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        <Icon
                          name={doc.type === 'application/pdf' ? 'DocumentTextIcon' : 'PhotoIcon'}
                          size={20}
                          className="text-primary"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="ml-3 p-2 text-error hover:bg-error/10 rounded transition-colors duration-base"
                    >
                      <Icon name="TrashIcon" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-muted rounded-md p-4 space-y-2">
              <div className="flex items-start space-x-2">
                <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-text-secondary space-y-1">
                  <p className="font-medium text-text-primary">Recommended Documents:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Latest semester marksheet or grade card</li>
                    <li>Consolidated marksheet (all semesters)</li>
                    <li>College ID card or bonafide certificate</li>
                    <li>Degree/provisional certificate (if available)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 rounded-md p-4 flex items-start space-x-3">
              <Icon name="ExclamationTriangleIcon" size={20} className="text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                Document upload is optional at this stage. You can upload verification documents later from your dashboard after registration.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          className="px-6 py-3 border border-border rounded-md text-text-primary font-medium hover:bg-muted transition-all duration-base flex items-center space-x-2"
        >
          <Icon name="ArrowLeftIcon" size={20} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-all duration-base flex items-center space-x-2 shadow-sm hover:shadow-md"
        >
          <span>{currentStep === 3 ? 'Continue to Career Preferences' : 'Next Step'}</span>
          <Icon name="ArrowRightIcon" size={20} />
        </button>
      </div>
    </div>
  );
};

export default AcademicDetailsForm;