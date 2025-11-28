import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Захиалга баталгаажуулах | MyRoom',
  description: 'Зочид буудлын захиалгаа баталгаажуулаарай. Шууд баталгаажуулалт.',
  openGraph: {
    title: 'Захиалга баталгаажуулах | MyRoom',
    description: 'Зочид буудлын захиалгаа баталгаажуулаарай.',
  },
};

export default function BookingLayout({ children }: { children: ReactNode }) {
  return children;
}
