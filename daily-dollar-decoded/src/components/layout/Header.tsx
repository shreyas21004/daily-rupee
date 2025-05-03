
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IndianRupee } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <IndianRupee className="text-primary" size={32} />
          <span className="text-2xl font-bold text-primary">DailyRupees</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/expenses" className="font-medium hover:text-primary transition-colors">Expenses</Link>
          <Link to="/budgets" className="font-medium hover:text-primary transition-colors">Budgets</Link>
          <Link to="/reports" className="font-medium hover:text-primary transition-colors">Reports</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {user?.name}
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

