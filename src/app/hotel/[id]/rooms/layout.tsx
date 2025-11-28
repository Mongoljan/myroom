import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Өрөө сонгох | MyRoom',
  description: 'Зочид буудлын өрөөнүүдийг харьцуулж, өөрт тохирохыг сонгоорой.',
  openGraph: {
    title: 'Өрөө сонгох | MyRoom',
    description: 'Зочид буудлын өрөөнүүдийг харьцуулж сонгоорой.',
  },
};

export default function RoomsLayout({ children }: { children: ReactNode }) {
  return children;
}
