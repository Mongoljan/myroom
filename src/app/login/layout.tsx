import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Нэвтрэх | MyRoom',
  description: 'Захиалгуудаа харах, бүртгэлээ удирдахын тулд нэвтрэнэ үү.',
  openGraph: {
    title: 'Нэвтрэх | MyRoom',
    description: 'MyRoom бүртгэлдээ нэвтрэх.',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}