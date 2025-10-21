import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { pauseContract, unpauseContract, isPaused, getOwner, getContractAddress } from '../utils/contract';
import { getConnectedAddress } from '../utils/web3';
import { formatAddress } from '../utils/format';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [owner, setOwner] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pausedStatus, ownerAddress, connected] = await Promise.all([
        isPaused(),
        getOwner(),
        getConnectedAddress(),
      ]);

      setPaused(pausedStatus);
      setOwner(ownerAddress);
      setConnectedAddress(connected || '');
      setIsOwner(connected && ownerAddress && connected.toLowerCase() === ownerAddress.toLowerCase());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do contrato');
    }
  }

  async function handlePause() {
    if (!isOwner) {
      toast.error('Apenas o owner pode pausar o contrato!');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Pausando contrato... Confirme no MetaMask');
      await pauseContract();
      toast.success('✅ Contrato pausado com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao pausar:', error);
      if (error.message.includes('user rejected')) {
        toast.error('Transação rejeitada pelo usuário');
      } else {
        toast.error('Erro ao pausar: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUnpause() {
    if (!isOwner) {
      toast.error('Apenas o owner pode despausar o contrato!');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Despausando contrato... Confirme no MetaMask');
      await unpauseContract();
      toast.success('✅ Contrato despausado com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao despausar:', error);
      if (error.message.includes('user rejected')) {
        toast.error('Transação rejeitada pelo usuário');
      } else {
        toast.error('Erro ao despausar: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Admin - CassoneCoin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">⚙️ Painel Admin</h1>
          <p className="text-slate-400">
            Gerenciamento e controle do contrato (apenas owner)
          </p>
        </div>

        {/* Status de Permissão */}
        {!isOwner && connectedAddress && (
          <div className="card bg-yellow-600/10 border-yellow-600/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-yellow-400 font-semibold">Acesso Restrito</p>
                <p className="text-slate-300 text-sm">
                  Você não é o owner do contrato. Apenas visualização disponível.
                </p>
              </div>
            </div>
          </div>
        )}

        {!connectedAddress && (
          <div className="card bg-red-600/10 border-red-600/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-red-400 font-semibold">Carteira Não Conectada</p>
                <p className="text-slate-300 text-sm">
                  Conecte sua carteira para acessar o painel admin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informações do Contrato */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">📋 Informações do Contrato</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400">Endereço do Contrato</span>
              <span className="text-white font-mono text-sm">{formatAddress(getContractAddress())}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400">Owner</span>
              <span className="text-white font-mono text-sm">{formatAddress(owner)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400">Sua Carteira</span>
              <span className="text-white font-mono text-sm">
                {connectedAddress ? formatAddress(connectedAddress) : 'Não conectada'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-400">Status</span>
              <span className={`font-semibold ${paused ? 'text-red-400' : 'text-green-400'}`}>
                {paused ? '⏸️ Pausado' : '✅ Ativo'}
              </span>
            </div>
          </div>
        </div>

        {/* Controles de Pausa */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">🎮 Controles</h2>
          
          <div className="space-y-4">
            {/* Status Atual */}
            <div className={`p-4 rounded-lg ${paused ? 'bg-red-600/20 border border-red-600/30' : 'bg-green-600/20 border border-green-600/30'}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{paused ? '⏸️' : '▶️'}</span>
                <div>
                  <p className={`font-semibold ${paused ? 'text-red-400' : 'text-green-400'}`}>
                    {paused ? 'Contrato Pausado' : 'Contrato Ativo'}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {paused 
                      ? 'Todas as transferências estão bloqueadas' 
                      : 'Todas as operações estão funcionando normalmente'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Controle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handlePause}
                disabled={loading || paused || !isOwner}
                className="btn bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {loading ? '⏳ Processando...' : '⏸️ Pausar Contrato'}
              </button>
              <button
                onClick={handleUnpause}
                disabled={loading || !paused || !isOwner}
                className="btn bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {loading ? '⏳ Processando...' : '▶️ Despausar Contrato'}
              </button>
            </div>
          </div>
        </div>

        {/* Informações sobre Pausa */}
        <div className="card bg-blue-600/10 border-blue-600/30">
          <h3 className="text-lg font-bold text-white mb-3">ℹ️ Sobre Pausar/Despausar</h3>
          <div className="space-y-3 text-slate-300 text-sm">
            <p>
              <strong>Pausar:</strong> Bloqueia todas as transferências de tokens. 
              Útil em caso de emergência ou vulnerabilidade detectada.
            </p>
            <p>
              <strong>Despausar:</strong> Reativa as transferências, permitindo que 
              o contrato funcione normalmente novamente.
            </p>
            <p className="text-yellow-400">
              ⚠️ Apenas o owner do contrato pode executar essas ações.
            </p>
          </div>
        </div>

        {/* Casos de Uso */}
        <div className="card bg-purple-600/10 border-purple-600/30">
          <h3 className="text-lg font-bold text-white mb-3">💡 Quando Pausar?</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>• <strong>Vulnerabilidade Detectada:</strong> Se você descobrir um bug ou falha de segurança</li>
            <li>• <strong>Ataque em Andamento:</strong> Para interromper atividades maliciosas</li>
            <li>• <strong>Manutenção:</strong> Durante upgrades ou mudanças importantes</li>
            <li>• <strong>Emergência:</strong> Qualquer situação que exija intervenção imediata</li>
          </ul>
        </div>

        {/* Outras Funcionalidades Admin */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4">🔧 Outras Funções Admin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/mint" className="btn btn-primary text-center">
              🪙 Mintar Tokens
            </a>
            <button
              disabled
              className="btn bg-slate-700 text-slate-400 cursor-not-allowed text-center"
              title="Em breve"
            >
              👑 Transferir Ownership
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            Mais funcionalidades administrativas serão adicionadas em breve.
          </p>
        </div>
      </div>
    </Layout>
  );
}
