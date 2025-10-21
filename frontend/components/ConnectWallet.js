import { useState, useEffect } from 'react';
import { connectWallet, isWalletConnected, getConnectedAddress, onAccountsChanged, onChainChanged } from '../utils/web3';
import { formatAddress } from '../utils/format';

export default function ConnectWallet({ onConnect }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkConnection();

    // Escuta mudanças de conta e rede
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(() => window.location.reload());

    return () => {
      // Cleanup listeners
    };
  }, []);

  async function checkConnection() {
    try {
      const connected = await isWalletConnected();
      if (connected) {
        const addr = await getConnectedAddress();
        setAddress(addr);
        if (onConnect) onConnect(addr);
      }
    } catch (error) {
      // Silenciosamente ignora erros de verificação inicial
      console.log('MetaMask não conectado ainda');
    }
  }

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setAddress(null);
      if (onConnect) onConnect(null);
    } else {
      const addr = accounts[0];
      setAddress(addr);
      if (onConnect) onConnect(addr);
    }
  }

  async function handleConnect() {
    setLoading(true);
    setError(null);

    try {
      const { address: addr } = await connectWallet();
      setAddress(addr);
      if (onConnect) onConnect(addr);
    } catch (err) {
      console.error('Erro ao conectar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded-lg border border-green-600/30">
          <span className="text-sm font-medium">{formatAddress(address)}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Conectando...' : '🦊 Conectar Carteira'}
      </button>
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
