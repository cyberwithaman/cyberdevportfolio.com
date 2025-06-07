"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Show nothing while checking authentication or redirecting
  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen relative">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full lg:w-[calc(100%-16rem)]">
        <main className="flex-1 overflow-y-auto p-4 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;