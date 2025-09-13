
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileText, Globe, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Globe },
  { href: '/documents', label: 'My Documents', icon: FileText },
  { href: '/chat', label: 'AI Chat', icon: Bot },
];

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b transition-colors duration-300",
      isHomePage ? 'bg-transparent text-white border-transparent' : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className={cn(
            "flex items-center gap-2 text-2xl font-bold font-headline transition-colors",
            isHomePage ? "text-white hover:text-white/80" : "text-primary hover:text-primary/80"
        )}>
          <Sparkles className="h-7 w-7" />
          WanderGenie
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Button key={link.href} asChild variant={isActive ? "secondary" : "ghost"} className={cn(isHomePage && !isActive && "text-white hover:bg-white/10 hover:text-white")}>
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="md:hidden">
            {/* Mobile menu could be added here */}
        </div>
      </div>
    </header>
  );
}
