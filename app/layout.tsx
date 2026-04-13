import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sravan Reddy – AI Developer | Hackathon Organizer',
  description: 'Personal portfolio of Sravan Reddy – AI Developer, Startup Builder, and Hackathon Organizer. Explore projects, skills, and experience.',
  keywords: ['AI Developer', 'Portfolio', 'Sravan Reddy', 'Hackathon', 'Python', 'LLMs'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
