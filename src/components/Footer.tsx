
import { Logo } from "./Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-secondary">
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Logo />
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4 md:mb-0">
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/trace" className="hover:text-foreground">Trace</Link>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} AgroTrace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
