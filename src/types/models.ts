// Application types (camelCase) for Next.js components
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'student' | 'college_admin' | 'admin';
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  accreditation?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  adminId?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  collegeId?: string;
  enrollmentNumber?: string;
  course: string;
  branch?: string;
  yearOfStudy?: number;
  graduationYear?: number;
  cgpa?: number;
  dateOfBirth?: string;
  gender?: string;
  studentStatus: 'active' | 'inactive' | 'graduated';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  skills?: string[];
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  userId: string;
  tier: 'free' | 'premium' | 'enterprise';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  paymentId?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CareerPreference {
  id: string;
  studentId: string;
  preferredIndustries?: string[];
  preferredLocations?: string[];
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  jobTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentDashboardData {
  userProfile: UserProfile;
  studentData: Student & {
    colleges?: College;
  };
  membership: Membership;
  careerPreferences: CareerPreference | null;
  profileCompletion: number;
}

export interface PremiumFeatureStats {
  wetTestsTaken: number;
  jobFairsAttended: number;
  expertTalksWatched: number;
  upcomingEvents: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

export interface FreeAccountAllocation {
  id: string;
  college_id: string;
  course: string;
  batch_year: number;
  total_quota: number;
  allocated_count: number;
  available_count: number;
  allocation_status: 'active' | 'depleted' | 'expired';
  renewal_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  college?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface AllocationHistory {
  id: string;
  allocation_id: string;
  action_type: string;
  previous_allocated?: number;
  new_allocated?: number;
  student_id?: string;
  performed_by?: string;
  notes?: string;
  created_at: string;
  student?: {
    id: string;
    user_profiles?: {
      full_name: string;
      email: string;
    };
  };
  performed_by_user?: {
    full_name: string;
    email: string;
  };
}

export interface AllocationStats {
  total_quota: number;
  total_allocated: number;
  total_available: number;
  active_allocations: number;
  depleted_allocations: number;
}

export interface SuccessStory {
  id: string;
  studentId: string;
  title: string;
  storyContent: string;
  videoUrl?: string;
  beforeRole?: string;
  afterRole: string;
  beforeSalary?: number;
  afterSalary: number;
  companyName: string;
  companyLogoUrl?: string;
  industry?: string;
  placementYear?: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    userId: string;
    course: string;
    branch?: string;
    graduationYear?: number;
    college?: {
      id: string;
      name: string;
      city?: string;
    };
    userProfile?: {
      id: string;
      fullName: string;
      avatarUrl?: string;
    };
  };
  // Additional properties for testimonial display (camelCase)
  graduateName?: string;
  previousRole?: string;
  currentRole?: string;
  currentCompany?: string;
  salaryBefore?: number;
  salaryAfter?: number;
  image?: string;
  testimonialText?: string;
  rating?: number;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// Notification types
export type NotificationType = 'verification_update' | 'allocation_change' | 'event_alert' | 'system_message';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  is_archived: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
  updated_at: string;
}