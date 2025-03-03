import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CuraSync - Healthcare Management System",
  description: "A comprehensive healthcare management system for doctors, patients, labs, and pharmacies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} antialiased h-full flex flex-col`}>
        <Toaster richColors position="top-center" />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}