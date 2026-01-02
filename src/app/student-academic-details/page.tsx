import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import StudentAcademicDetailsInteractive from './components/StudentAcademicDetailsInteractive';

export const metadata: Metadata = {
  title: 'Academic Details - Winhive Registration Portal',
  description: 'Provide your college information, course details, graduation timeline, and academic performance to complete your Winhive premium membership registration.',
};

export default function StudentAcademicDetailsPage() {
  return (
    <>
      <Header />
      <StudentAcademicDetailsInteractive />
    </>
  );
}