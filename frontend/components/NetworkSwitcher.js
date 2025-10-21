import { useState, useEffect } from 'react';
import { getChainId, switchChain, addChain, NETWORKS, fromHex, toHex } from '../utils/metamask';
import toast from 'react-hot-toast';

export default function NetworkSwitcher() {
  const [currentChainId, setCurrentChainId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChainId();
  }, []);

  async function loadChainId() {
    const chainId = await getChainId();
    if (chainId) {
      setCurrentChainId(fromHex(chainId));
    }
  }

  async function handleSwitchNetwork(networkKey) {
    setLoading(true);

    try {
      const network = NETWORKS[networkKey];
      
      try {
        // Tenta trocar para a rede
        await switchChain(network.chainId);
        toast.success(`Trocado para ${network.chainName}!`);
        await loadChainId();
      } catch (error) {
        // Se a rede não existe, tenta adicionar
        if (error.message.includes('não está configurada')) {
          await addChain(network);
          toast.success(`Rede ${network.chainName} adicionada!`);
          await loadChainId();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Erro ao trocar rede:', error);
      toast.error('Erro ao trocar rede: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 97: return 'BSC Testnet';
      case 56: return 'BSC Mainnet';
      case 11155111: return 'Sepolia';
      case 1: return 'Ethereum';
      case 31337: return 'Localhost';
      default: return `Chain ${chainId}`;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-white mb-4">🌐 Trocar Rede</h3>
      
      {currentChainId && (
        <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
          <p className="text-slate-400 text-sm">Rede Atual:</p>
          <p className="text-white font-semibold">{getNetworkName(currentChainId)}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => handleSwitchNetwork('BSC_TESTNET')}
          disabled={loading || currentChainId === 97}
          className="btn btn-primary text-sm"
        >
          BSC Testnet
        </button>
        <button
          onClick={() => handleSwitchNetwork('BSC_MAINNET')}
          disabled={loading || currentChainId === 56}
          className="btn bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
        >
          BSC Mainnet
        </button>
        <button
          onClick={() => handleSwitchNetwork('SEPOLIA')}
          disabled={loading || currentChainId === 11155111}
          className="btn bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          Sepolia Testnet
        </button>
        <button
          onClick={() => handleSwitchNetwork('ETHEREUM')}
          disabled={loading || currentChainId === 1}
          className="btn bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Ethereum Mainnet
        </button>
      </div>

      <p className="text-slate-400 text-xs mt-4">
        💡 Se a rede não existir no MetaMask, ela será adicionada automaticamente.
      </p>
    </div>
  );
}
