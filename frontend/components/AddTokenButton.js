import { useState } from 'react';
import { watchAsset } from '../utils/metamask';
import { getContractAddress, getTokenInfo } from '../utils/contract';
import toast from 'react-hot-toast';

export default function AddTokenButton() {
  const [loading, setLoading] = useState(false);

  async function handleAddToken() {
    setLoading(true);

    try {
      const contractAddress = getContractAddress();
      if (!contractAddress) {
        toast.error('Endereço do contrato não configurado');
        setLoading(false);
        return;
      }

      // Obtém informações do token
      const { symbol, decimals } = await getTokenInfo();

      // Adiciona o token ao MetaMask
      const wasAdded = await watchAsset({
        address: contractAddress,
        symbol: symbol,
        decimals: decimals,
        image: '', // Você pode adicionar uma URL de imagem do token aqui
      });

      if (wasAdded) {
        toast.success(`Token ${symbol} adicionado ao MetaMask!`);
      } else {
        toast.error('Token não foi adicionado');
      }
    } catch (error) {
      console.error('Erro ao adicionar token:', error);
      toast.error('Erro ao adicionar token: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToken}
      disabled={loading}
      className="btn bg-orange-600 hover:bg-orange-700 text-white text-sm"
      title="Adicionar CASS ao MetaMask"
    >
      {loading ? '⏳ Adicionando...' : '🦊 Adicionar ao MetaMask'}
    </button>
  );
}
