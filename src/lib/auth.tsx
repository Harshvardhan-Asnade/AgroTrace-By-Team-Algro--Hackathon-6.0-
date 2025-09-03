'use client';
import { useRouter, usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'admin' | null;

export type User = {
  id: string;
  email: string | undefined;
  role: UserRole;
};

interface WalletState {
  address: string | null;
  provider: ethers.BrowserProvider | null;
}

interface AuthContextType {
  user: User | null;
  wallet: WalletState;
  login: (role: UserRole) => void;
  logout: () => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<WalletState>({ address: null, provider: null });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleSession = useCallback(async (session: Session | null) => {
    if (session) {
      const user: User = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role as UserRole,
      };
      setUser(user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await handleSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
       handleSession(session);
    });

    const storedWalletAddress = localStorage.getItem('agritrace-wallet');
    if(storedWalletAddress) {
      setWallet(prev => ({...prev, address: storedWalletAddress}));
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  useEffect(() => {
    if (!loading && !user && !['/login', '/register', '/', '/#about', '/#features'].includes(pathname) && !pathname.startsWith('/trace')) {
        router.push('/login');
    }
  }, [user, loading, router, pathname]);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install it to use this feature.');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      localStorage.setItem('agritrace-wallet', address);
      setWallet({ address, provider });
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    localStorage.removeItem('agritrace-wallet');
    setWallet({ address: null, provider: null });
  }, []);

  const login = (role: UserRole) => {
    // This function will be handled by Supabase UI now,
    // but we can keep it for any potential manual login flows in the future.
    console.log('Redirecting to login page...');
    router.push('/login');
  };
  
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    disconnectWallet();
    setUser(null);
    router.push('/login');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, wallet, login, logout, connectWallet, disconnectWallet, loading }}>
      {!loading && children}
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
