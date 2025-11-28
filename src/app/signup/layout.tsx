import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Бүртгүүлэх | MyRoom',
  description: 'MyRoom-д нэгдэж онцгой урамшуулал, хялбар захиалгын үйлчилгээ аваарай.',
  openGraph: {
    title: 'Бүртгүүлэх | MyRoom',
    description: 'MyRoom-д нэгдэж онцгой урамшуулал аваарай.',
  },
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
