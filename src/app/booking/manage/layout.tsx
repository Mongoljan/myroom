import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Захиалга удирдах | MyRoom',
  description: 'Таны зочид буудлын захиалгын мэдээллийг харах, удирдах.',
  openGraph: {
    title: 'Захиалга удирдах | MyRoom',
    description: 'Таны зочид буудлын захиалгын мэдээллийг харах, удирдах.',
  },
};

export default function ManageBookingLayout({ children }: { children: ReactNode }) {
  return children;
}
