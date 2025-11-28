import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Terms of Service | MyRoom',
  description: 'Read the terms and conditions for using MyRoom hotel booking platform. Understand your rights and responsibilities.',
  openGraph: {
    title: 'Terms of Service | MyRoom',
    description: 'Terms and conditions for MyRoom hotel booking.',
  },
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
