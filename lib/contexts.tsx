import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, DICTIONARY } from './i18n';

// Auth Types
interface User {
  email: string;
  name: string;
  avatar?: string; // URL or color string
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: keyof typeof DICTIONARY['en']) => string;
  // Auth
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, avatar?: string) => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children?: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLangState] = useState<Lang>('vi'); 
  
  // --- TEMPORARY BYPASS LOGIN ---
  // Initialize with a mock user so the UI renders correctly without logging in
  const [user, setUser] = useState<User | null>({
      email: "admin@demo.com",
      name: "Admin User",
      avatar: undefined
  }); 

  useEffect(() => {
    // Load settings
    const savedTheme = localStorage.getItem('cr_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme);
    
    const savedLang = localStorage.getItem('cr_lang') as Lang;
    if (savedLang) setLangState(savedLang);

    // LOGIN CHECK DISABLED FOR MVP DEV
    /*
    const session = localStorage.getItem('cr_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('cr_session');
      }
    }
    */
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('cr_lang', l);
  }

  const t = (key: keyof typeof DICTIONARY['en']) => {
    return DICTIONARY[lang][key] || key;
  };

  // --- Auth Logic (Mock) ---
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    // DISABLED
    console.log("Login temporarily disabled");
    return true;
  };

  const register = async (email: string, pass: string): Promise<boolean> => {
     // DISABLED
     return true;
  }

  const logout = () => {
      // DISABLED: Prevent logout in this mode
      // setUser(null);
      // localStorage.removeItem('cr_session');
      alert("Logout is temporarily disabled.");
  }

  const updateProfile = async (name: string, avatar?: string) => {
      if (!user) return;
      await new Promise(r => setTimeout(r, 300));
      const updatedUser = { ...user, name, avatar: avatar || user.avatar };
      setUser(updatedUser);
      // localStorage.setItem('cr_session', JSON.stringify(updatedUser));
  }

  const changePassword = async (oldPass: string, newPass: string): Promise<boolean> => {
      // Mock success
      await new Promise(r => setTimeout(r, 500));
      return true;
  }

  return (
    <AppContext.Provider value={{ 
        theme, toggleTheme, lang, setLang, t,
        user, login, register, logout, updateProfile, changePassword, 
        isAuthenticated: true // Force true
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};