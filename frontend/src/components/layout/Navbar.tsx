import { Search, Bell, Moon, Sun, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/button';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search candidates, skills..."
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                HR
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">HR Manager</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-soft-lg z-50 overflow-hidden animate-in fade-in slide-up">
                <div className="p-1">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                    <div className="font-medium text-foreground">HR Manager</div>
                    <div className="text-xs">hr@company.com</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
