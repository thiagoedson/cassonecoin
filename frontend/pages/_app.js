import '../styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Suprime erros do MetaMask no console durante desenvolvimento
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.toString().includes('MetaMask') ||
        args[0]?.toString().includes('inpage.js')
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <Component {...pageProps} />;
}
