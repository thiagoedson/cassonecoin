import { ethers } from 'ethers';
import { getProvider, getSigner } from './web3';

// ABI do contrato CassoneCoin
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "function pause()",
  "function unpause()",
  "function paused() view returns (bool)",
  "function owner() view returns (address)",
  "function getMaxSupply() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

/**
 * Obtém o endereço do contrato do ambiente
 * @returns {string}
 */
export function getContractAddress() {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!address || address === '') {
    console.warn('⚠️ Endereço do contrato não configurado. Crie o arquivo .env.local');
    return null;
  }
  return address;
}

/**
 * Cria uma instância do contrato (somente leitura)
 * @returns {ethers.Contract}
 */
export function getContract() {
  const address = getContractAddress();
  if (!address) {
    throw new Error('Contrato não configurado');
  }
  const provider = getProvider();
  if (!provider) {
    throw new Error('Provider não disponível');
  }
  return new ethers.Contract(address, CONTRACT_ABI, provider);
}

/**
 * Cria uma instância do contrato com signer (para escrita)
 * @returns {Promise<ethers.Contract>}
 */
export async function getContractWithSigner() {
  const signer = await getSigner();
  if (!signer) {
    throw new Error('Signer não disponível. Conecte sua carteira primeiro.');
  }
  return new ethers.Contract(getContractAddress(), CONTRACT_ABI, signer);
}

/**
 * Obtém informações básicas do token
 * @returns {Promise<{name: string, symbol: string, decimals: number}>}
 */
export async function getTokenInfo() {
  try {
    const contract = getContract();
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]);
    return { name, symbol, decimals: Number(decimals) };
  } catch (error) {
    console.error('Erro ao obter info do token:', error);
    throw error;
  }
}

/**
 * Obtém o supply total
 * @returns {Promise<string>}
 */
export async function getTotalSupply() {
  try {
    const contract = getContract();
    const supply = await contract.totalSupply();
    return ethers.formatEther(supply);
  } catch (error) {
    console.error('Erro ao obter supply total:', error);
    return '0';
  }
}

/**
 * Obtém o supply máximo (cap)
 * @returns {Promise<string>}
 */
export async function getMaxSupply() {
  try {
    const contract = getContract();
    const maxSupply = await contract.getMaxSupply();
    return ethers.formatEther(maxSupply);
  } catch (error) {
    console.error('Erro ao obter supply máximo:', error);
    return '10000000'; // Valor padrão
  }
}

/**
 * Obtém o saldo de um endereço
 * @param {string} address - Endereço a consultar
 * @returns {Promise<string>}
 */
export async function getBalance(address) {
  try {
    const contract = getContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    return '0';
  }
}

/**
 * Verifica se o contrato está pausado
 * @returns {Promise<boolean>}
 */
export async function isPaused() {
  try {
    const contract = getContract();
    return await contract.paused();
  } catch (error) {
    console.error('Erro ao verificar pause:', error);
    return false;
  }
}

/**
 * Obtém o owner do contrato
 * @returns {Promise<string>}
 */
export async function getOwner() {
  try {
    const contract = getContract();
    return await contract.owner();
  } catch (error) {
    console.error('Erro ao obter owner:', error);
    return '';
  }
}

/**
 * Minta novos tokens (apenas owner)
 * @param {string} to - Endereço destino
 * @param {string} amount - Quantidade em formato legível
 * @returns {Promise<ethers.TransactionReceipt>}
 */
export async function mintTokens(to, amount) {
  try {
    const contract = await getContractWithSigner();
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.mint(to, amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao mintar tokens:', error);
    throw error;
  }
}

/**
 * Transfere tokens
 * @param {string} to - Endereço destino
 * @param {string} amount - Quantidade em formato legível
 * @returns {Promise<ethers.TransactionReceipt>}
 */
export async function transferTokens(to, amount) {
  try {
    const contract = await getContractWithSigner();
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.transfer(to, amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao transferir tokens:', error);
    throw error;
  }
}

/**
 * Queima tokens
 * @param {string} amount - Quantidade em formato legível
 * @returns {Promise<ethers.TransactionReceipt>}
 */
export async function burnTokens(amount) {
  try {
    const contract = await getContractWithSigner();
    const amountWei = ethers.parseEther(amount);
    const tx = await contract.burn(amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao queimar tokens:', error);
    throw error;
  }
}

/**
 * Pausa o contrato (apenas owner)
 * @returns {Promise<ethers.TransactionReceipt>}
 */
export async function pauseContract() {
  try {
    const contract = await getContractWithSigner();
    const tx = await contract.pause();
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao pausar contrato:', error);
    throw error;
  }
}

/**
 * Despausa o contrato (apenas owner)
 * @returns {Promise<ethers.TransactionReceipt>}
 */
export async function unpauseContract() {
  try {
    const contract = await getContractWithSigner();
    const tx = await contract.unpause();
    return await tx.wait();
  } catch (error) {
    console.error('Erro ao despausar contrato:', error);
    throw error;
  }
}

/**
 * Escuta eventos de Transfer
 * @param {Function} callback - Função a ser chamada quando um evento ocorrer
 */
export function onTransfer(callback) {
  try {
    const contract = getContract();
    contract.on('Transfer', (from, to, value, event) => {
      callback({
        from,
        to,
        value: ethers.formatEther(value),
        blockNumber: event.log.blockNumber,
        transactionHash: event.log.transactionHash
      });
    });
  } catch (error) {
    console.error('Erro ao escutar eventos:', error);
  }
}

/**
 * Remove listeners de eventos
 */
export function removeEventListeners() {
  try {
    const contract = getContract();
    contract.removeAllListeners();
  } catch (error) {
    console.error('Erro ao remover listeners:', error);
  }
}
