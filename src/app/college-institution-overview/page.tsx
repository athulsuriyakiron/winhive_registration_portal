import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import CollegeOverviewInteractive from './components/CollegeOverviewInteractive';

export const metadata: Metadata = {
  title: 'College Partnership - Winhive Registration Portal',
  description: 'Transform your institution\'s placement success with Winhive. Partner with India\'s premier fresher placement ecosystem to deliver measurable career outcomes and enhance institutional reputation.',
};

export default function CollegeInstitutionOverviewPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 lg:pt-20">
        <CollegeOverviewInteractive />
      </div>
    </main>
  );
}