import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LanguageSwitcher from "./components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ModelArena",
  description: "Built with AI-Assisted Development"
};

export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'en';
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageSwitcher />
        {children}
      </body>
    </html>
  );
}
