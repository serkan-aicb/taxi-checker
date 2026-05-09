import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";

const SITE_URL = "https://taxi-checker.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TaxiChecker – Bewertungen für Taxifahrer in Deutschland",
    template: "%s | TaxiChecker",
  },
  description:
    "Finden und bewerten Sie Taxifahrer in Ihrer Stadt. TaxiChecker – die Vertrauensplattform für Taxi- und Fahrdienstfahrer in Deutschland.",
  keywords: ["taxifahrer bewertung", "taxi bewerten", "taxifahrer deutschland", "taxi checker"],
  authors: [{ name: "TaxiChecker", url: SITE_URL }],
  creator: "TaxiChecker",
  publisher: "TaxiChecker",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: "TaxiChecker",
    title: "TaxiChecker – Bewertungen für Taxifahrer in Deutschland",
    description:
      "Die Vertrauensplattform für Taxifahrer. Bewertungen lesen, selbst bewerten, QR-Code scannen.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "TaxiChecker – Bewertungsplattform für Taxifahrer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaxiChecker – Bewertungen für Taxifahrer",
    description: "Die Vertrauensplattform für Taxifahrer in Deutschland.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1" id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
