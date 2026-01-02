import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import CareerPreferencesInteractive from './components/CareerPreferencesInteractive';

export const metadata: Metadata = {
  title: 'Career Preferences - Winhive Registration Portal',
  description: 'Define your career aspirations, industry preferences, salary expectations, and work location choices to receive personalized job recommendations and placement support tailored to your goals.',
};

export default function StudentCareerPreferencesPage() {
  return (
    <>
      <Header />
      <CareerPreferencesInteractive />
    </>
  );
}