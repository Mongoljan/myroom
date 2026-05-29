import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Захиалга шалгах | MyRoom',
  description: 'Таны зочид буудлын захиалгын мэдээллийг харах, удирдах.',
  openGraph: {
    title: 'Захиалга шалгах | MyRoom',
    description: 'Таны зочид буудлын захиалгын мэдээллийг харах, удирдах.',
  },
};

export default function ManageBookingLayout({ children }: { children: ReactNode }) {
  return children;
}
