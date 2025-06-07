import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import ClientLayout from "@/app/components/Layout/ClientLayout";

export const metadata: Metadata = {
  title: "Aman Anil - Ai-SecOps Research",  
  description: "Expert in AI Security Operations (AI- SecOps), focusing on machine learning security, threat detection, and automated security solutions. Research and development in AI-driven cybersecurity, cloud security, and DevSecOps.",
  keywords: "AI Security, SecOps, Machine Learning Security, Cybersecurity Research, AI-SecOps, Security Automation, Cloud Security, DevSecOps, Artificial Intelligence Security, Threat Detection, Security Research, Security Operations, AI Development, Security Engineering, MLOps Security",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
