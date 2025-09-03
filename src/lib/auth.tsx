'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'admin' | null;

export type User = {
  name: string;
  role: UserRole;
};

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('agritrace-user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.role) { // Basic validation
          setUser(parsedUser);
        } else {
          localStorage.removeItem('agritrace-user');
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('agritrace-user');
    }
    setLoading(false);
  }, []);

  const login = useCallback((role: UserRole) => {
    if (!role) return;
    const newUser: User = { name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`, role };
    localStorage.setItem('agritrace-user', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('agritrace-user');
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
