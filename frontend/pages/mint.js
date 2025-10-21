import { useState } from 'react';
import Layout from '../components/Layout';
import { mintTokens, getMaxSupply, getTotalSupply } from '../utils/contract';
import { isValidAddress, isValidAmount, formatNumber } from '../utils/format';
import toast from 'react-hot-toast';

export default function MintPage() {
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!isValidAddress(formData.to)) {
      toast.error('Endereço inválido!');
      return;
    }

    if (!isValidAmount(formData.amount)) {
      toast.error('Quantidade inválida!');
      return;
    }

    setLoading(true);
    setTxHash(null);

    try {
      // Verifica se não vai ultrapassar o cap
      const [total, max] = await Promise.all([
        getTotalSupply(),
        getMaxSupply(),
      ]);

      const newTotal = parseFloat(total) + parseFloat(formData.amount);
      if (newTotal > parseFloat(max)) {
        toast.error(`Quantidade excede o cap máximo! Disponível: ${formatNumber(parseFloat(max) - parseFloat(total))}`);
        setLoading(false);
        return;
      }

      toast.loading('Mintando tokens... Confirme no MetaMask');
      
      const receipt = await mintTokens(formData.to, formData.amount);
      
      setTxHash(receipt.hash);
      toast.success(`✅ ${formData.amount} tokens mintados com sucesso!`);
      
      // Limpa o formulário
      setFormData({ to: '', amount: '' });
    } catch (error) {
      console.error('Erro ao mintar:', error);
      
      if (error.message.includes('user rejected')) {
        toast.error('Transação rejeitada pelo usuário');
      } else if (error.message.includes('Ownable')) {
        toast.error('Apenas o owner pode mintar tokens!');
      } else {
        toast.error('Erro ao mintar tokens: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Mintar Tokens - CassoneCoin">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">🪙 Mintar Tokens</h1>
          <p className="text-slate-400">
            Crie novos tokens CASS (apenas owner)
          </p>
        </div>

        {/* Formulário */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Endereço Destino */}
            <div>
              <label htmlFor="to" className="label">
                Endereço Destino
              </label>
              <input
                type="text"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleChange}
                placeholder="0x..."
                className="input"
                required
                disabled={loading}
              />
              <p className="text-slate-400 text-sm mt-2">
                Endereço Ethereum que receberá os tokens
              </p>
            </div>

            {/* Quantidade */}
            <div>
              <label htmlFor="amount" className="label">
                Quantidade
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="1000"
                step="0.01"
                min="0"
                className="input"
                required
                disabled={loading}
              />
              <p className="text-slate-400 text-sm mt-2">
                Quantidade de tokens CASS a mintar
              </p>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? '⏳ Mintando...' : '🪙 Mintar Tokens'}
            </button>
          </form>

          {/* Hash da Transação */}
          {txHash && (
            <div className="mt-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">✅ Transação Confirmada!</p>
              <p className="text-slate-300 text-sm break-all">
                Hash: {txHash}
              </p>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="card bg-blue-600/10 border-blue-600/30">
          <h3 className="text-lg font-bold text-white mb-3">ℹ️ Informações</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Apenas o owner do contrato pode mintar tokens</li>
            <li>• O total não pode ultrapassar o cap de 10 milhões</li>
            <li>• A transação requer confirmação no MetaMask</li>
            <li>• Você pagará gas fees em ETH</li>
          </ul>
        </div>

        {/* Exemplo */}
        <div className="card bg-purple-600/10 border-purple-600/30">
          <h3 className="text-lg font-bold text-white mb-3">💡 Exemplo</h3>
          <div className="space-y-2 text-slate-300 text-sm">
            <p><strong>Endereço:</strong> 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb</p>
            <p><strong>Quantidade:</strong> 1000</p>
            <p className="text-slate-400 mt-3">
              Isso criará 1000 tokens CASS e enviará para o endereço especificado.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
