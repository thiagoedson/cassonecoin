import { ethers } from 'ethers';

/**
 * Formata um endereço Ethereum para exibição
 * @param {string} address - Endereço completo
 * @returns {string} Endereço formatado (0x1234...5678)
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formata um valor de token (de wei para unidade legível)
 * @param {string|number} value - Valor em wei
 * @param {number} decimals - Número de decimais (padrão 18)
 * @returns {string} Valor formatado
 */
export function formatTokenAmount(value, decimals = 18) {
  try {
    return ethers.formatUnits(value, decimals);
  } catch (error) {
    console.error('Erro ao formatar valor:', error);
    return '0';
  }
}

/**
 * Converte um valor legível para wei
 * @param {string} value - Valor legível
 * @param {number} decimals - Número de decimais (padrão 18)
 * @returns {bigint} Valor em wei
 */
export function parseTokenAmount(value, decimals = 18) {
  try {
    return ethers.parseUnits(value.toString(), decimals);
  } catch (error) {
    console.error('Erro ao converter valor:', error);
    return 0n;
  }
}

/**
 * Formata um número com separadores de milhares
 * @param {string|number} value - Valor a formatar
 * @returns {string} Valor formatado
 */
export function formatNumber(value) {
  if (!value) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Formata uma data/timestamp
 * @param {number} timestamp - Timestamp em segundos
 * @returns {string} Data formatada
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formata tempo relativo (ex: "2 minutos atrás")
 * @param {number} timestamp - Timestamp em segundos
 * @returns {string} Tempo relativo
 */
export function formatTimeAgo(timestamp) {
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
  return `${Math.floor(diff / 86400)} dias atrás`;
}

/**
 * Valida um endereço Ethereum
 * @param {string} address - Endereço a validar
 * @returns {boolean} True se válido
 */
export function isValidAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Valida um valor numérico
 * @param {string} value - Valor a validar
 * @returns {boolean} True se válido
 */
export function isValidAmount(value) {
  if (!value || value === '') return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}
