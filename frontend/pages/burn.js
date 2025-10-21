import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { burnTokens, getBalance, getTotalSupply } from '../utils/contract';
import { getConnectedAddress } from '../utils/web3';
import { isValidAmount, formatNumber } from '../utils/format';
import toast from 'react-hot-toast';

export default function BurnPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [userBalance, setUserBalance] = useState('0');
  const [totalSupply, setTotalSupply] = useState('0');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [supply] = await Promise.all([
        getTotalSupply(),
      ]);
      setTotalSupply(supply);

      const address = await getConnectedAddress();
      if (address) {
        const balance = await getBalance(address);
        setUserBalance(balance);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  const handleMaxClick = () => {
    setAmount(userBalance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!isValidAmount(amount)) {
      toast.error('Quantidade inválida!');
      return;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      toast.error('Saldo insuficiente!');
      return;
    }

    setLoading(true);
    setTxHash(null);

    try {
      toast.loading('Queimando tokens... Confirme no MetaMask');
      
      const receipt = await burnTokens(amount);
      
      setTxHash(receipt.hash);
      toast.success(`🔥 ${amount} tokens queimados com sucesso!`);
      
      // Limpa o formulário e recarrega dados
      setAmount('');
      await loadData();
    } catch (error) {
      console.error('Erro ao queimar:', error);
      
      if (error.message.includes('user rejected')) {
        toast.error('Transação rejeitada pelo usuário');
      } else if (error.message.includes('insufficient')) {
        toast.error('Saldo insuficiente!');
      } else if (error.message.includes('paused')) {
        toast.error('Contrato está pausado!');
      } else {
        toast.error('Erro ao queimar tokens: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Queimar Tokens - CassoneCoin">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">🔥 Queimar Tokens</h1>
          <p className="text-slate-400">
            Destrua permanentemente seus tokens CASS
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-gradient-to-br from-green-600 to-green-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Seu Saldo</p>
                <p className="text-3xl font-bold text-white">{formatNumber(parseFloat(userBalance).toFixed(2))}</p>
                <p className="text-white/60 text-xs">CASS disponíveis</p>
              </div>
              <div className="text-4xl">👛</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-600 to-orange-700 border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">Supply Total</p>
                <p className="text-3xl font-bold text-white">{formatNumber(parseFloat(totalSupply).toFixed(2))}</p>
                <p className="text-white/60 text-xs">CASS em circulação</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantidade */}
            <div>
              <label htmlFor="amount" className="label">
                Quantidade a Queimar
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  disabled={loading}
                >
                  MAX
                </button>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Quantidade de tokens CASS a destruir permanentemente
              </p>
            </div>

            {/* Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                <p className="text-red-400 font-semibold mb-2">🔥 Você está prestes a queimar:</p>
                <p className="text-white text-2xl font-bold">{formatNumber(parseFloat(amount).toFixed(2))} CASS</p>
                <p className="text-slate-400 text-sm mt-2">
                  Novo saldo: {formatNumber((parseFloat(userBalance) - parseFloat(amount)).toFixed(2))} CASS
                </p>
                <p className="text-slate-400 text-sm">
                  Novo supply: {formatNumber((parseFloat(totalSupply) - parseFloat(amount)).toFixed(2))} CASS
                </p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || parseFloat(userBalance) === 0}
              className="btn btn-danger w-full"
            >
              {loading ? '⏳ Queimando...' : '🔥 Queimar Tokens'}
            </button>
          </form>

          {/* Hash da Transação */}
          {txHash && (
            <div className="mt-6 p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-green-400 font-semibold mb-2">✅ Tokens Queimados!</p>
              <p className="text-slate-300 text-sm break-all">
                Hash: {txHash}
              </p>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="card bg-blue-600/10 border-blue-600/30">
          <h3 className="text-lg font-bold text-white mb-3">ℹ️ O que é Queimar?</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• <strong>Queimar</strong> (burn) significa destruir tokens permanentemente</li>
            <li>• Os tokens queimados são removidos do supply total</li>
            <li>• Isso reduz a quantidade de tokens em circulação</li>
            <li>• Pode aumentar o valor dos tokens restantes (deflação)</li>
            <li>• A operação é irreversível</li>
          </ul>
        </div>

        {/* Aviso */}
        <div className="card bg-red-600/10 border-red-600/30">
          <h3 className="text-lg font-bold text-red-400 mb-3">⚠️ ATENÇÃO</h3>
          <p className="text-slate-300 text-sm mb-3">
            Queimar tokens é uma ação <strong>PERMANENTE e IRREVERSÍVEL</strong>!
          </p>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• Os tokens serão destruídos para sempre</li>
            <li>• Você não poderá recuperá-los</li>
            <li>• Certifique-se da quantidade antes de confirmar</li>
            <li>• Você pagará gas fees em ETH</li>
          </ul>
        </div>

        {/* Exemplo de Uso */}
        <div className="card bg-purple-600/10 border-purple-600/30">
          <h3 className="text-lg font-bold text-white mb-3">💡 Por que Queimar?</h3>
          <div className="space-y-3 text-slate-300 text-sm">
            <p>
              <strong>Reduzir Supply:</strong> Diminui a quantidade total de tokens, 
              potencialmente aumentando o valor dos restantes.
            </p>
            <p>
              <strong>Deflação:</strong> Cria um efeito deflacionário no token, 
              tornando-o mais escasso.
            </p>
            <p>
              <strong>Tokenomics:</strong> Parte de estratégias de gestão de supply 
              e valorização do token.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
