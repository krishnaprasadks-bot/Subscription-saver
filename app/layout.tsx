import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SaaS Bleed Calculator | Monthly Salary After Tax India Calculator',
  description: 'Find out how much money is wasted on subscriptions. Instant SaaS bleed calculator and monthly salary after tax calculator with instant insights.',
  keywords: 'cancel netflix subscription, cancel spotify subscription, how much money wasted on subscriptions, monthly salary after tax india calculator',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How to cancel a subscription?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use our SaaS Bleed Calculator to find cancellation links for Netflix, Spotify, Amazon Prime, and more immediately."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much money is wasted on subscriptions?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The average person wastes hundreds of dollars a year on unused subscriptions. Calculate your exact SaaS bleed instantly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How to calculate monthly salary after tax in India?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Use our Salary Calculator to instantly see your monthly in-hand salary under the new tax regime, adjusted for inflation."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
