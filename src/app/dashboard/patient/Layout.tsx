"use client";
import React from 'react';
import Layout from '@/components/patient/Layout';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}