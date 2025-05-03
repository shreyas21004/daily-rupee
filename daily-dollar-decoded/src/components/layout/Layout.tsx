
import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="md:hidden flex items-center px-4 py-2">
        <MobileNav />
      </div>
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DailyDollar Expense Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
