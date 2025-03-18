import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = '12条点検劣化調査アプリ' }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>{title}</title>
        <meta name="description" content="12条点検における外壁・建物の劣化調査入力アプリ" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-center">{title}</h1>
      </header>

      <main className="container mx-auto p-4 max-w-md">
        {children}
      </main>

      <footer className="bg-gray-200 p-3 text-center text-sm text-gray-600 mt-8">
        <p>© {new Date().getFullYear()} 12条点検劣化調査アプリ</p>
      </footer>
    </div>
  );
};

export default Layout; 