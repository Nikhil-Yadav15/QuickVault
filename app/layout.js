import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./componets/Navbar";
import Footer from "./componets/footer";
import Head from 'next/head';
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
    <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-bl from-blue-900 to-black`}>
        <Navbar />
        <main className="flex-grow overflow-auto">
          {children}
        </main>
          <Footer />
      </body>
    </html>
  );
}
