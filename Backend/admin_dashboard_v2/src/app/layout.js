// ---- /src/app/layout.js ----
import React from 'react';
import './globals.css';
import Header from './components/Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans antialiased text-gray-900 min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}