import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Lost Items', path: '/lost-items' },
    { name: 'Found Items', path: '/found-items' },
    { name: 'Report Lost', path: '/report-lost' },
    { name: 'Report Found', path: '/report-found' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-300 border-glow">
              <Search className="w-5 h-5 text-background" />
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary glow-text">FINDIT</span>
              <span className="text-2xl font-bold text-foreground">.AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 interactive-scale ${
                  isActive(item.path)
                    ? 'bg-primary text-background shadow-lg shadow-primary/50'
                    : 'text-foreground hover:bg-secondary hover:text-primary border border-transparent hover:border-primary/20'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon" className="border-primary/30 hover:border-primary interactive-scale">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-border">
              <nav className="flex flex-col space-y-3 mt-8">
                <Link to="/" className="flex items-center space-x-2 mb-6 group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-5 h-5 text-background" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">FINDIT</span>
                    <span className="text-2xl font-bold text-foreground">.AI</span>
                  </div>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-primary text-background shadow-lg shadow-primary/50'
                        : 'text-foreground hover:bg-secondary hover:text-primary border border-transparent hover:border-primary/20'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
