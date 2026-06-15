import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GMIIE | UFO Truth Surface",
  description: "GMIIE UFO Truth Surface — interactive public catalog for PURSUE releases, Stargate, Gateway. Seeded videos & cool imagery (site down workaround). Clean, scalable demo of the sovereign agentic system. Full backend for real-time decipher, code breaks, and signed PDF downloads.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GMIIE UFO",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-[#ddd]`}>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}

// PWA install prompt support (global, works across pages)
declare global {
  interface Window {
    deferredPrompt?: any;
  }
}
