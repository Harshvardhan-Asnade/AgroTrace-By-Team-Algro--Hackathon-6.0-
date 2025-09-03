'use client';

import { useAuth } from '@/lib/auth';
import { Button } from './ui/button';
import { Logo } from './Logo';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User as UserIcon, LogOut, LayoutDashboard, Wallet, Unplug } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout, loading, wallet, connectWallet, disconnectWallet } = useAuth();
  const pathname = usePathname();

  const getInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : '..';
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-6 hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          {isHomePage && (
            <>
               <Link href="/#about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
               <Link href="/#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
            </>
          )}
          {user && <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>}
          {user?.role === 'admin' && <Link href="/admin/smart-contract-auditor" className="transition-colors hover:text-foreground/80 text-foreground/60">Auditor</Link>}
          <Link href="/trace" className="transition-colors hover:text-foreground/80 text-foreground/60">Trace</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {loading ? (
            <div className="w-48 h-8 bg-muted rounded-md animate-pulse" />
          ) : user ? (
            <>
              {wallet.address ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Wallet className="mr-2" />
                      {formatAddress(wallet.address)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={disconnectWallet}>
                      <Unplug className="mr-2 h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={connectWallet}>
                  <Wallet className="mr-2" />
                  Connect Wallet
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} alt={user.email || ''} />
                      <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dashboard</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
