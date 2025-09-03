'use client';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';

export type UserRole = 'farmer' | 'distributor' | 'retailer' | 'admin' | null;

export type User = {
  name: string;
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
  logout: () => void;
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

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('agritrace-user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        if (parsedUser.role) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('agritrace-user');
        }
      }
      const storedWalletAddress = localStorage.getItem('agritrace-wallet');
      if(storedWalletAddress) {
        setWallet(prev => ({...prev, address: storedWalletAddress}));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('agritrace-user');
      localStorage.removeItem('agritrace-wallet');
    }
    setLoading(false);
  }, []);

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
    disconnectWallet(); // Also disconnect wallet on logout
    router.push('/login');
  }, [router, disconnectWallet]);

  return (
    <AuthContext.Provider value={{ user, wallet, login, logout, connectWallet, disconnectWallet, loading }}>
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
