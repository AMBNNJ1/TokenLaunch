import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Providers } from "./Providers";
import ErrorBoundary from "../components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tweet-Pow - Tweet-Powered Raydium Coin Launcher",
  description: "Discover trending tweets and launch meme coins on Raydium with one click. Turn viral tweets into tradeable tokens instantly.",
  keywords: ["Tweet", "Meme Coin", "Raydium", "Solana", "Token Launch", "Social Trading", "Viral", "Twitter", "Crypto"],
  authors: [{ name: "Tweet-Pow Team" }],
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
