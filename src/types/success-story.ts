// SuccessStory type definition for testimonial management
export interface SuccessStory {
  id: string;
  graduateName: string;
  previousRole: string;
  currentRole: string;
  currentCompany: string;
  salaryBefore: number;
  salaryAfter: number;
  image: string;
  testimonialText: string;
  rating: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}