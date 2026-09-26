import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบบริหารจัดการและทะเบียนคุมพัสดุ-ครุภัณฑ์ | Enterprise Fixed Asset System',
  description: 'ระบบทะเบียนคุมพัสดุและครุภัณฑ์ พิมพ์สติกเกอร์ QR Code คำนวณค่าเสื่อมราคา และตรวจนับพัสดุประจำปี',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-100 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
