import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Figtree, Lora } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontFigtree = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontLora = Lora({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'WanderGenie',
  description: 'Your AI-powered travel partner. Craft your perfect journey in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", fontFigtree.variable, fontLora.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
