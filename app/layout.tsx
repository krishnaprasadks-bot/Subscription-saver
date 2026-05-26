import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
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
        {/* Google tag (gtag.js) */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-GBZEE0V9JM" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-GBZEE0V9JM');
          `}
        </Script>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZ2RQCLV');`,
          }}
        />
        {/* End Google Tag Manager */}
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
      <body className="antialiased bg-[#0B0F14] text-white font-sans" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZ2RQCLV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
