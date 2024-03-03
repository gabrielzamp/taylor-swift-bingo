import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taylow Swift Bingo",
  description: "Developed by Iza Zomkowski & Gabriel Zampieri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-white bg-[#381a5a]`}>{children}</body>
    </html>
  );
}
