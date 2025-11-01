import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import "augmented-ui/augmented-ui.min.css";
import "./globals.css";

const quantico = Quantico({
  weight: "400",
  variable: "--font-quantico-sans",
  subsets: ["latin"],
  display: "swap", // Recommended for better performance
});

export const metadata: Metadata = {
  title: "Blackbody Radiation Explorer",
  description: "GBlackbody Radiation Explorer by Physic Group 6, CSE P batch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quantico.variable}  antialiased`}>{children}</body>
    </html>
  );
}
