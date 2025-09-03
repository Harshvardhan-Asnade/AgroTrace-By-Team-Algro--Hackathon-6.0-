
'use client';

import { Button } from './ui/button';
import { Logo } from './Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
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
          <Link href="/admin/smart-contract-auditor" className="transition-colors hover:text-foreground/80 text-foreground/60">Auditor</Link>
          <Link href="/trace" className="transition-colors hover:text-foreground/80 text-foreground/60">Trace</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="space-x-2">
              <Button asChild variant="ghost">
                <Link href="#">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="#">Register</Link>
              </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
