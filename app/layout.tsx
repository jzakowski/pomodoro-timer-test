import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pomodoro Timer',
  description: 'Beautiful Pomodoro Timer for productive work sessions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
