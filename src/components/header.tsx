
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, FileText, Globe, Home, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Globe },
  { href: '/documents', label: 'My Documents', icon: FileText },
  { href: '/chat', label: 'AI Chat', icon: Bot },
];

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    if (isHomePage) {
      // Set initial state
      handleScroll();
      
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // On other pages, header is always "scrolled"
      setScrolled(true);
    }
  }, [isHomePage]);

  const headerClasses = cn(
    "sticky top-0 z-50 w-full border-b transition-colors duration-300",
    isHomePage && !scrolled
      ? "bg-transparent border-transparent"
      : "bg-navbar/95 backdrop-blur supports-[backdrop-filter]:bg-navbar/60 border-border"
  );
  
  const navLinkBaseClasses = "transition-colors";
  const transparentHeaderLinkClasses = "text-white hover:bg-white/10 hover:text-white";
  const solidHeaderLinkClasses = "text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground";
  
  const logoClasses = cn(
      "flex items-center gap-2 text-2xl font-bold font-headline transition-colors",
       isHomePage && !scrolled ? "text-white hover:text-white/80" : "text-primary-foreground hover:text-primary-foreground/80"
  );

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className={logoClasses}>
          <Sparkles className="h-7 w-7" />
          WanderGenie
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Button 
                key={link.href} 
                asChild 
                variant={isActive ? "secondary" : "ghost"} 
                className={cn(
                  navLinkBaseClasses,
                  isHomePage && !scrolled ? transparentHeaderLinkClasses : solidHeaderLinkClasses,
                  isActive && isHomePage && !scrolled && "bg-white/20 text-white",
                  isActive && scrolled && "bg-background/20 text-white"
                )}
              >
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
