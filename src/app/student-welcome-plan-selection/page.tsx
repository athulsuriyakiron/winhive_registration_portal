import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import StudentWelcomeInteractive from './components/StudentWelcomeInteractive';

export const metadata: Metadata = {
  title: 'Student Welcome & Plan Selection - Winhive Registration Portal',
  description: 'Join India\'s first fresher-focused job placement ecosystem. Premium membership at ₹3,500/year with WET testing, exclusive job fairs, expert guidance, and proven placement strategies. Transform your career uncertainty into success with 95% placement rate.',
};

export default function StudentWelcomePage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        <StudentWelcomeInteractive />
      </main>
    </>
  );
}