/**
 * MetaMask Provider API - Implementação completa seguindo a documentação oficial
 * @see https://docs.metamask.io/wallet/reference/provider-api/
 */

/**
 * Verifica se o MetaMask está instalado
 * @returns {boolean}
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

/**
 * Verifica se o provider está conectado à chain atual
 * @returns {boolean}
 */
export function isProviderConnected() {
  if (!isMetaMaskInstalled()) return false;
  return window.ethereum.isConnected();
}

/**
 * Verifica se o MetaMask está desbloqueado
 * @returns {Promise<boolean>}
 */
export async function isMetaMaskUnlocked() {
  if (!isMetaMaskInstalled()) return false;
  
  try {
    return await window.ethereum._metamask.isUnlocked();
  } catch (error) {
    console.error('Erro ao verificar se MetaMask está desbloqueado:', error);
    return false;
  }
}

/**
 * Solicita conexão com o MetaMask (eth_requestAccounts)
 * @returns {Promise<string[]>} Array de endereços de contas
 */
export async function requestAccounts() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado! Instale em https://metamask.io');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a conexão');
    }
    throw error;
  }
}

/**
 * Obtém as contas conectadas (eth_accounts)
 * @returns {Promise<string[]>} Array de endereços de contas
 */
export async function getAccounts() {
  if (!isMetaMaskInstalled()) return [];

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts;
  } catch (error) {
    console.error('Erro ao obter contas:', error);
    return [];
  }
}

/**
 * Obtém o chain ID atual (eth_chainId)
 * @returns {Promise<string>} Chain ID em hexadecimal
 */
export async function getChainId() {
  if (!isMetaMaskInstalled()) return null;

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    return chainId;
  } catch (error) {
    console.error('Erro ao obter chain ID:', error);
    return null;
  }
}

/**
 * Solicita troca de rede (wallet_switchEthereumChain)
 * @param {string} chainId - Chain ID em hexadecimal (ex: '0x61' para BSC Testnet)
 * @returns {Promise<void>}
 */
export async function switchChain(chainId) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    // Erro 4902: Chain não existe no MetaMask
    if (error.code === 4902) {
      throw new Error('Esta rede não está configurada no MetaMask');
    }
    // Erro 4001: Usuário rejeitou
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a troca de rede');
    }
    throw error;
  }
}

/**
 * Adiciona uma nova rede ao MetaMask (wallet_addEthereumChain)
 * @param {Object} chainConfig - Configuração da rede
 * @returns {Promise<void>}
 */
export async function addChain(chainConfig) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [chainConfig],
    });
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a adição da rede');
    }
    throw error;
  }
}

/**
 * Adiciona um token ao MetaMask (wallet_watchAsset)
 * @param {Object} tokenConfig - Configuração do token
 * @returns {Promise<boolean>}
 */
export async function watchAsset(tokenConfig) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: tokenConfig,
      },
    });
    return wasAdded;
  } catch (error) {
    console.error('Erro ao adicionar token:', error);
    return false;
  }
}

/**
 * Obtém o saldo de uma conta (eth_getBalance)
 * @param {string} address - Endereço da conta
 * @param {string} block - Bloco (padrão: 'latest')
 * @returns {Promise<string>} Saldo em wei (hexadecimal)
 */
export async function getBalance(address, block = 'latest') {
  if (!isMetaMaskInstalled()) return '0x0';

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, block],
    });
    return balance;
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    return '0x0';
  }
}

/**
 * Envia uma transação (eth_sendTransaction)
 * @param {Object} transaction - Objeto da transação
 * @returns {Promise<string>} Hash da transação
 */
export async function sendTransaction(transaction) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });
    return txHash;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a transação');
    }
    throw error;
  }
}

/**
 * Assina uma mensagem (personal_sign)
 * @param {string} message - Mensagem a ser assinada
 * @param {string} address - Endereço da conta
 * @returns {Promise<string>} Assinatura
 */
export async function signMessage(message, address) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });
    return signature;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('Usuário rejeitou a assinatura');
    }
    throw error;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Escuta mudanças de conta (accountsChanged)
 * @param {Function} callback - Função a ser chamada quando as contas mudarem
 * @returns {Function} Função para remover o listener
 */
export function onAccountsChanged(callback) {
  if (!isMetaMaskInstalled()) return () => {};

  window.ethereum.on('accountsChanged', callback);
  
  return () => {
    window.ethereum.removeListener('accountsChanged', callback);
  };
}

/**
 * Escuta mudanças de rede (chainChanged)
 * @param {Function} callback - Função a ser chamada quando a rede mudar
 * @returns {Function} Função para remover o listener
 */
export function onChainChanged(callback) {
  if (!isMetaMaskInstalled()) return () => {};

  window.ethereum.on('chainChanged', callback);
  
  return () => {
    window.ethereum.removeListener('chainChanged', callback);
  };
}

/**
 * Escuta evento de conexão (connect)
 * @param {Function} callback - Função a ser chamada quando conectar
 * @returns {Function} Função para remover o listener
 */
export function onConnect(callback) {
  if (!isMetaMaskInstalled()) return () => {};

  window.ethereum.on('connect', callback);
  
  return () => {
    window.ethereum.removeListener('connect', callback);
  };
}

/**
 * Escuta evento de desconexão (disconnect)
 * @param {Function} callback - Função a ser chamada quando desconectar
 * @returns {Function} Função para remover o listener
 */
export function onDisconnect(callback) {
  if (!isMetaMaskInstalled()) return () => {};

  window.ethereum.on('disconnect', callback);
  
  return () => {
    window.ethereum.removeListener('disconnect', callback);
  };
}

/**
 * Escuta mensagens do provider (message)
 * @param {Function} callback - Função a ser chamada quando receber mensagem
 * @returns {Function} Função para remover o listener
 */
export function onMessage(callback) {
  if (!isMetaMaskInstalled()) return () => {};

  window.ethereum.on('message', callback);
  
  return () => {
    window.ethereum.removeListener('message', callback);
  };
}

/**
 * Remove todos os event listeners
 */
export function removeAllListeners() {
  if (!isMetaMaskInstalled()) return;

  window.ethereum.removeAllListeners();
}

// ============================================
// CONFIGURAÇÕES DE REDES COMUNS
// ============================================

export const NETWORKS = {
  BSC_TESTNET: {
    chainId: '0x61', // 97
    chainName: 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
  },
  BSC_MAINNET: {
    chainId: '0x38', // 56
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
  },
  SEPOLIA: {
    chainId: '0xaa36a7', // 11155111
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
  },
  ETHEREUM: {
    chainId: '0x1', // 1
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://etherscan.io'],
  },
};

/**
 * Converte chain ID decimal para hexadecimal
 * @param {number} chainId - Chain ID em decimal
 * @returns {string} Chain ID em hexadecimal
 */
export function toHex(chainId) {
  return `0x${chainId.toString(16)}`;
}

/**
 * Converte chain ID hexadecimal para decimal
 * @param {string} chainId - Chain ID em hexadecimal
 * @returns {number} Chain ID em decimal
 */
export function fromHex(chainId) {
  return parseInt(chainId, 16);
}
