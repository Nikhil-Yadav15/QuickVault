import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./componets/Navbar";
import Footer from "./componets/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickVault",
  description: "A simple file sharing app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col`}
        style={{
          background: "radial-gradient(ellipse at top, #0f172a 0%, #0a0a0f 50%, #000000 100%)",
        }}
      >
        <Navbar />
        <main className="flex-grow overflow-auto relative z-10" style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
