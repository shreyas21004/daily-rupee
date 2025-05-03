
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden px-0 text-base">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            to="/"
            className="block px-2 py-2 text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/expenses"
            className="block px-2 py-2 text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Expenses
          </Link>
          <Link
            to="/budgets"
            className="block px-2 py-2 text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Budgets
          </Link>
          <Link
            to="/reports"
            className="block px-2 py-2 text-lg font-medium hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Reports
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
