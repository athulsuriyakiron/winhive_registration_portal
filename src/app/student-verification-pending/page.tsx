import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import VerificationInteractive from './components/VerificationInteractive';

export const metadata: Metadata = {
  title: 'Verification Pending - Winhive Registration Portal',
  description: 'Your Winhive premium membership application is being verified. Track your verification status, explore demo content, and get ready to start your placement preparation journey.',
};

export default function StudentVerificationPendingPage() {
  return (
    <>
      <Header />
      <VerificationInteractive />
    </>
  );
}