import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Library, Sparkles, Moon, Sun, Globe, LogOut, User, Settings, HelpCircle, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../lib/contexts';
import { Button, DropdownMenu, DropdownContent, DropdownItem, DropdownSeparator, DropdownTrigger, Avatar } from './ui/primitives';

export default function AppShell({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, theme, toggleTheme, lang, setLang, user, logout } = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const active = location.pathname.startsWith(to);
    return (
      <Link to={to} className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 relative",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}>
        {/* Active Indicator Strip */}
        {active && <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />}
        
        <Icon className={cn("w-4.5 h-4.5 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        {label}
      </Link>
    );
  };

  const handleLogout = () => {
      logout();
  }

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (path === 'dashboard') return t('dashboard');
    if (path === 'library') return t('library');
    if (path === 'studio') return t('studio');
    // if (path === 'profile') return t('profile');
    return t('dashboard');
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar - Added backdrop blur */}
      <aside className="w-64 border-r border-border/60 bg-background/80 flex flex-col fixed inset-y-0 z-20 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col justify-center">
               <span className="font-bold text-sm tracking-tight leading-none text-foreground">Content Reborn</span>
               <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Internal Tools</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 mb-3 mt-2 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest">Platform</div>
          <NavItem to="/dashboard" icon={LayoutDashboard} label={t('dashboard')} />
          <NavItem to="/library" icon={Library} label={t('library')} />
        </nav>

        {/* User Dropdown Area */}
        <div className="p-4 border-t border-border/50 bg-muted/5">
             <DropdownMenu>
                 <DropdownTrigger onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                     <div className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-transparent hover:border-border hover:bg-background hover:shadow-sm cursor-pointer transition-all duration-200 group">
                         <Avatar 
                             src={user?.avatar} 
                             fallback={user?.name.substring(0,2).toUpperCase() || "U"} 
                             className="h-8 w-8 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 border-0"
                         />
                         <div className="flex-1 min-w-0 text-left">
                             <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">{user?.name}</p>
                             <p className="text-xs text-muted-foreground truncate opacity-80">{user?.email}</p>
                         </div>
                         <ChevronUp className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                     </div>
                 </DropdownTrigger>
                 
                 <DropdownContent 
                    isOpen={isDropdownOpen} 
                    onClose={() => setIsDropdownOpen(false)}
                    className="w-60 mb-2 bottom-full left-4"
                 >
                     <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30">
                         {t('loggedInAs')} <span className="font-medium text-foreground block mt-0.5">{user?.email}</span>
                     </div>
                     <DropdownSeparator />
                     
                     {/* Profile Link Temporarily Disabled
                     <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                        <DropdownItem>
                             <Settings className="w-4 h-4 mr-2" />
                             {t('settings')}
                        </DropdownItem>
                     </Link>
                     */}

                     <DropdownItem className="opacity-50 cursor-not-allowed">
                         <Sparkles className="w-4 h-4 mr-2" />
                         {t('upgradePlan')}
                     </DropdownItem>
                     <DropdownSeparator />
                     <DropdownItem onClick={() => window.open('https://google.com', '_blank')}>
                         <HelpCircle className="w-4 h-4 mr-2" />
                         {t('help')}
                     </DropdownItem>
                 </DropdownContent>
             </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen bg-muted/5 transition-colors duration-300">
        <header className="h-16 border-b border-border/60 bg-background/70 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <span className="font-medium text-foreground">{getPageTitle()}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="gap-1.5 h-8 text-muted-foreground hover:text-foreground rounded-full px-3 border border-transparent hover:border-border">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-bold">{lang}</span>
            </Button>
            <div className="h-4 w-px bg-border/60"></div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}