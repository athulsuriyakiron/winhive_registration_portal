import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import StudentPersonalInfoInteractive from './components/StudentPersonalInfoInteractive';

export const metadata: Metadata = {
  title: 'Personal Information - Winhive Registration Portal',
  description: 'Provide your personal details for Winhive premium membership registration. Secure form with real-time validation and data protection.',
};

export default function StudentPersonalInformationPage() {
  return (
    <>
      <Header />
      <StudentPersonalInfoInteractive />
    </>
  );
}