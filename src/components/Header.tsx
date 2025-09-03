
'use client';

import { Button } from './ui/button';
import { Logo } from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useWallet } from '@/lib/wallet';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Wallet } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { user, logout } = useAuth();
  const { connectWallet, disconnectWallet, address } = useWallet();

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }

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
          <Link href="/admin/smart-contract-auditor" className="transition-colors hover:text-foreground/80 text-foreground/60">Auditor</Link>
          <Link href="/trace" className="transition-colors hover:text-foreground/80 text-foreground/60">Trace</Link>
          {user && <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
             <div className="flex items-center gap-2">
                {address ? (
                   <Button variant="outline" onClick={disconnectWallet}>
                     <Wallet className="mr-2" />
                     {truncateAddress(address)}
                    </Button>
                ) : (
                  <Button variant="outline" onClick={connectWallet}><Wallet className="mr-2"/> Connect Wallet</Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">{user.email}</span>
                      <Badge variant="outline">{user.user_metadata.role}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
