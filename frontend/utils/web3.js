import { ethers } from 'ethers';
import * as metamask from './metamask';

let provider = null;
let signer = null;

/**
 * Conecta à carteira MetaMask usando a API oficial
 * @returns {Promise<{provider, signer, address}>}
 */
export async function connectWallet() {
  if (!metamask.isMetaMaskInstalled()) {
    throw new Error('MetaMask não está instalado! Instale em https://metamask.io');
  }

  try {
    // Solicita acesso às contas usando a API oficial do MetaMask
    const accounts = await metamask.requestAccounts();
    
    if (accounts.length === 0) {
      throw new Error('Nenhuma conta disponível');
    }

    // Cria provider e signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    console.error('Erro ao conectar carteira:', error);
    throw error;
  }
}

/**
 * Obtém o provider atual
 * @returns {ethers.BrowserProvider}
 */
export function getProvider() {
  if (!provider) {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      provider = new ethers.BrowserProvider(window.ethereum);
    }
  }
  return provider;
}

/**
 * Obtém o signer atual
 * @returns {Promise<ethers.Signer>}
 */
export async function getSigner() {
  if (!signer) {
    const prov = getProvider();
    if (prov) {
      signer = await prov.getSigner();
    }
  }
  return signer;
}

/**
 * Verifica se a carteira está conectada usando a API oficial
 * @returns {Promise<boolean>}
 */
export async function isWalletConnected() {
  if (!metamask.isMetaMaskInstalled()) {
    return false;
  }

  try {
    const accounts = await metamask.getAccounts();
    return accounts.length > 0 && metamask.isProviderConnected();
  } catch (error) {
    // Silenciosamente ignora erros de conexão
    return false;
  }
}

/**
 * Obtém o endereço da conta conectada
 * @returns {Promise<string|null>}
 */
export async function getConnectedAddress() {
  try {
    const sign = await getSigner();
    if (sign) {
      return await sign.getAddress();
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Obtém o saldo de ETH da conta
 * @param {string} address - Endereço da conta
 * @returns {Promise<string>}
 */
export async function getEthBalance(address) {
  try {
    const prov = getProvider();
    if (!prov) return '0';
    
    const balance = await prov.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Erro ao obter saldo ETH:', error);
    return '0';
  }
}

/**
 * Obtém informações da rede
 * @returns {Promise<{chainId: number, name: string}>}
 */
export async function getNetworkInfo() {
  try {
    const prov = getProvider();
    if (!prov) return { chainId: 0, name: 'Desconhecida' };
    
    const network = await prov.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
    };
  } catch (error) {
    console.error('Erro ao obter info da rede:', error);
    return { chainId: 0, name: 'Desconhecida' };
  }
}

/**
 * Troca para uma rede específica
 * @param {number} chainId - ID da rede
 */
export async function switchNetwork(chainId) {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask não está instalado!');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error) {
    // Se a rede não existe, tenta adicionar
    if (error.code === 4902) {
      throw new Error('Rede não configurada no MetaMask');
    }
    throw error;
  }
}

/**
 * Escuta mudanças de conta
 * @param {Function} callback - Função a ser chamada quando a conta mudar
 */
export function onAccountsChanged(callback) {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', callback);
  }
}

/**
 * Escuta mudanças de rede
 * @param {Function} callback - Função a ser chamada quando a rede mudar
 */
export function onChainChanged(callback) {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('chainChanged', callback);
  }
}

/**
 * Remove listeners
 */
export function removeListeners() {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }
}
