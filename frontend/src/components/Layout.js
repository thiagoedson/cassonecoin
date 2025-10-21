import { useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children, title = 'CassoneCoin Dashboard' }) {
  const [connectedAddress, setConnectedAddress] = useState(null);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Dashboard de gerenciamento do CassoneCoin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-900">
        <Header onWalletConnect={setConnectedAddress} />
        
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-slate-800 border-t border-slate-700 mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
            <p>© 2024 CassoneCoin. Desenvolvido com ❤️</p>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f1f5f9',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f1f5f9',
            },
          },
        }}
      />
    </>
  );
}
