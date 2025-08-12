import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

// Load League Spartan font with weight 300 (ExtraThin)
const leagueSpartan = League_Spartan({
  weight: "300", // ExtraThin
  subsets: ["latin"],
  variable: "--font-league-spartan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stock Flow",
  description: "Landing page for StockFlow enterprise",
  icons: {
    icon: '/stockflow-high-resolution-logo-grayscale-transparent.ico', // root-relative path!
  },
};

export default function RootLayout({
  children,
}: {
  children:React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.variable} font-sans antialiased`}>

        {children}
      </body>
    </html>
  );
}
