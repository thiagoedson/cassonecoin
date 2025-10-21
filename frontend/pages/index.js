import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import AddTokenButton from '../components/AddTokenButton';
import NetworkSwitcher from '../components/NetworkSwitcher';
import { getTotalSupply, getMaxSupply, getBalance, getTokenInfo, isPaused, getContractAddress } from '../utils/contract';
import { getConnectedAddress } from '../utils/web3';
import { formatNumber } from '../utils/format';
import toast from 'react-hot-toast';

export default function Home() {
  const [stats, setStats] = useState({
    totalSupply: '0',
    maxSupply: '10,000,000',
    userBalance: '0',
    paused: false,
  });
  const [tokenInfo, setTokenInfo] = useState({ name: 'CassoneCoin', symbol: 'CASS', decimals: 18 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      // Carrega informações do token
      const info = await getTokenInfo();
      setTokenInfo(info);

      // Carrega supply
      const [total, max, paused] = await Promise.all([
        getTotalSupply(),
        getMaxSupply(),
        isPaused(),
      ]);

      // Carrega saldo do usuário se conectado
      let balance = '0';
      const address = await getConnectedAddress();
      if (address) {
        balance = await getBalance(address);
      }

      setStats({
        totalSupply: formatNumber(parseFloat(total).toFixed(2)),
        maxSupply: formatNumber(parseFloat(max).toFixed(0)),
        userBalance: formatNumber(parseFloat(balance).toFixed(2)),
        paused,
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      if (error.message.includes('Contrato não configurado')) {
        toast.error('Configure o endereço do contrato no arquivo .env.local');
      } else {
        toast.error('Erro ao carregar dados do contrato');
      }
      
      setLoading(false);
    }
  }

  // Verifica se o contrato está configurado
  const contractAddress = getContractAddress();
  
  if (!contractAddress) {
    return (
      <Layout title="Configuração - CassoneCoin">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-yellow-600/10 border-yellow-600/30">
            <div className="text-center space-y-4">
              <div className="text-6xl">⚙️</div>
              <h2 className="text-2xl font-bold text-white">Configuração Necessária</h2>
              <p className="text-slate-300">
                O endereço do contrato não está configurado.
              </p>
              
              <div className="bg-slate-800 p-4 rounded-lg text-left space-y-3">
                <p className="text-slate-300 font-semibold">📝 Passos para configurar:</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-400 text-sm">
                  <li>Execute o script: <code className="bg-slate-700 px-2 py-1 rounded">.\setup.ps1</code></li>
                  <li>Ou crie manualmente o arquivo <code className="bg-slate-700 px-2 py-1 rounded">.env.local</code></li>
                  <li>Adicione: <code className="bg-slate-700 px-2 py-1 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS=0x...</code></li>
                  <li>Reinicie o servidor: <code className="bg-slate-700 px-2 py-1 rounded">npm run dev</code></li>
                </ol>
              </div>
              
              <div className="pt-4">
                <a 
                  href="https://github.com/yourusername/cassone-coin#setup" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  📖 Ver Documentação
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Dashboard - CassoneCoin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">🪙</div>
            <p className="text-xl text-slate-300">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard - CassoneCoin">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard {tokenInfo.symbol}
          </h1>
          <p className="text-slate-400">
            Visão geral do token {tokenInfo.name}
          </p>
        </div>

        {/* Status do Contrato */}
        {stats.paused && (
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-400 font-semibold">Contrato Pausado</p>
                <p className="text-red-300 text-sm">As transferências estão temporariamente desabilitadas</p>
              </div>
            </div>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon="💰"
            title="Supply Total"
            value={stats.totalSupply}
            subtitle={`${tokenInfo.symbol} em circulação`}
            color="indigo"
          />
          <StatsCard
            icon="📊"
            title="Supply Máximo"
            value={stats.maxSupply}
            subtitle={`Cap de ${tokenInfo.symbol}`}
            color="purple"
          />
          <StatsCard
            icon="👛"
            title="Seu Saldo"
            value={stats.userBalance}
            subtitle={`${tokenInfo.symbol} na sua carteira`}
            color="green"
          />
          <StatsCard
            icon="🔥"
            title="Disponível"
            value={formatNumber((parseFloat(stats.maxSupply.replace(/,/g, '')) - parseFloat(stats.totalSupply.replace(/,/g, ''))).toFixed(0))}
            subtitle="Tokens que podem ser mintados"
            color="orange"
          />
        </div>

        {/* Progresso do Supply */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">📈 Progresso do Supply</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Supply Atual</span>
              <span>{((parseFloat(stats.totalSupply.replace(/,/g, '')) / parseFloat(stats.maxSupply.replace(/,/g, ''))) * 100).toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(parseFloat(stats.totalSupply.replace(/,/g, '')) / parseFloat(stats.maxSupply.replace(/,/g, ''))) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>0</span>
              <span>{stats.maxSupply} {tokenInfo.symbol}</span>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <a href="/mint" className="btn btn-primary text-center">
              🪙 Mintar Tokens
            </a>
            <a href="/transfer" className="btn btn-secondary text-center">
              📤 Transferir
            </a>
            <a href="/burn" className="btn btn-danger text-center">
              🔥 Queimar
            </a>
            <a href="/admin" className="btn bg-slate-700 hover:bg-slate-600 text-white text-center">
              ⚙️ Admin
            </a>
          </div>
          <div className="flex justify-center">
            <AddTokenButton />
          </div>
        </div>

        {/* Trocar Rede */}
        <NetworkSwitcher />

        {/* Informações do Token */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">ℹ️ Informações do Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Nome</p>
              <p className="text-white font-semibold">{tokenInfo.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Símbolo</p>
              <p className="text-white font-semibold">{tokenInfo.symbol}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Decimais</p>
              <p className="text-white font-semibold">{tokenInfo.decimals}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Status</p>
              <p className={`font-semibold ${stats.paused ? 'text-red-400' : 'text-green-400'}`}>
                {stats.paused ? '⏸️ Pausado' : '✅ Ativo'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
