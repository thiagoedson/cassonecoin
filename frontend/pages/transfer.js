import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { transferTokens, getBalance } from '../utils/contract';
import { getConnectedAddress } from '../utils/web3';
import { isValidAddress, isValidAmount, formatNumber } from '../utils/format';
import toast from 'react-hot-toast';

export default function TransferPage() {
  const [formData, setFormData] = useState({
    to: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [userBalance, setUserBalance] = useState('0');

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    try {
      const address = await getConnectedAddress();
      if (address) {
        const balance = await getBalance(address);
        setUserBalance(balance);
      }
    } catch (error) {
      console.error('Erro ao carregar saldo:', error);
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleMaxClick = () => {
    setFormData({
      ...formData,
      amount: userBalance,
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

    if (parseFloat(formData.amount) > parseFloat(userBalance)) {
      toast.error('Saldo insuficiente!');
      return;
    }

    setLoading(true);
    setTxHash(null);

    try {
      toast.loading('Transferindo tokens... Confirme no MetaMask');
      
      const receipt = await transferTokens(formData.to, formData.amount);
      
      setTxHash(receipt.hash);
      toast.success(`✅ ${formData.amount} tokens transferidos com sucesso!`);
      
      // Limpa o formulário e recarrega saldo
      setFormData({ to: '', amount: '' });
      await loadBalance();
    } catch (error) {
      console.error('Erro ao transferir:', error);
      
      if (error.message.includes('user rejected')) {
        toast.error('Transação rejeitada pelo usuário');
      } else if (error.message.includes('insufficient')) {
        toast.error('Saldo insuficiente!');
      } else if (error.message.includes('paused')) {
        toast.error('Contrato está pausado!');
      } else {
        toast.error('Erro ao transferir tokens: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Transferir Tokens - CassoneCoin">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">📤 Transferir Tokens</h1>
          <p className="text-slate-400">
            Envie tokens CASS para outro endereço
          </p>
        </div>

        {/* Saldo */}
        <div className="card bg-gradient-to-br from-green-600 to-green-700 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Seu Saldo Disponível</p>
              <p className="text-3xl font-bold text-white">{formatNumber(parseFloat(userBalance).toFixed(2))} CASS</p>
            </div>
            <div className="text-4xl">👛</div>
          </div>
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
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="100"
                  step="0.01"
                  min="0"
                  max={userBalance}
                  className="input pr-20"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
                  disabled={loading}
                >
                  MAX
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Quantidade de tokens CASS a transferir
              </p>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || parseFloat(userBalance) === 0}
              className="btn btn-primary w-full"
            >
              {loading ? '⏳ Transferindo...' : '📤 Transferir Tokens'}
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
            <li>• Você precisa ter saldo suficiente de CASS</li>
            <li>• A transação requer confirmação no MetaMask</li>
            <li>• Você pagará gas fees em ETH</li>
            <li>• A transferência é irreversível</li>
            <li>• Verifique o endereço antes de confirmar</li>
          </ul>
        </div>

        {/* Aviso */}
        <div className="card bg-yellow-600/10 border-yellow-600/30">
          <h3 className="text-lg font-bold text-yellow-400 mb-3">⚠️ Atenção</h3>
          <p className="text-slate-300 text-sm">
            Sempre verifique o endereço de destino antes de confirmar a transação. 
            Transferências para endereços incorretos não podem ser revertidas!
          </p>
        </div>
      </div>
    </Layout>
  );
}
