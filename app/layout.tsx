
import "./globals.css";
import React from "react";

export const metadata = { title: "Mātṛkā Preview", description: "Spiritual Companion" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
