
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

type WalletContextType = {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loading: boolean;
};

const WalletContext = createContext<WalletContextType>({
  provider: null,
  signer: null,
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  loading: false,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        variant: 'destructive',
        title: 'MetaMask Not Detected',
        description: 'Please install MetaMask to use this feature.',
      });
      return;
    }

    try {
      setLoading(true);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      const userSigner = await web3Provider.getSigner();
      setSigner(userSigner);

      const userAddress = await userSigner.getAddress();
      setAddress(userAddress);
      
      toast({
        title: 'Wallet Connected',
        description: `Connected with address: ${userAddress.substring(0,6)}...`,
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        variant: 'destructive',
        title: 'Wallet Connection Failed',
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    toast({
      title: 'Wallet Disconnected',
    });
  };

  useEffect(() => {
    if (window.ethereum) {
       window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
            connectWallet();
        } else {
            disconnectWallet();
        }
      });
    }
    return () => {
       if (window.ethereum && window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners();
      }
    }
  }, []);


  const value = {
    provider,
    signer,
    address,
    connectWallet,
    disconnectWallet,
    loading,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
