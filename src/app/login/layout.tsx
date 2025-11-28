import { Metadata } from 'next';
import AuthLayout from "@/components/layout/AuthLayout";

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
  return <AuthLayout>{children}</AuthLayout>;
}