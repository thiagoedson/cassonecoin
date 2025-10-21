# 🦊 MetaMask API - Implementação Completa

## 📚 Documentação Oficial Implementada

Implementação completa baseada na documentação oficial do MetaMask:
- https://docs.metamask.io/wallet/reference/provider-api/
- https://docs.metamask.io/wallet/reference/json-rpc-methods/

---

## ✨ Funcionalidades Implementadas

### 1. **Conexão com Carteira**
```javascript
import { connectWallet } from '../utils/web3';

const { provider, signer, address } = await connectWallet();
```

### 2. **Adicionar Token ao MetaMask**
```javascript
import { watchAsset } from '../utils/metamask';

await watchAsset({
  address: '0x...',
  symbol: 'CASS',
  decimals: 18,
  image: 'https://...'
});
```

### 3. **Trocar de Rede**
```javascript
import { switchChain, NETWORKS } from '../utils/metamask';

await switchChain(NETWORKS.BSC_TESTNET.chainId);
```

### 4. **Adicionar Nova Rede**
```javascript
import { addChain, NETWORKS } from '../utils/metamask';

await addChain(NETWORKS.BSC_TESTNET);
```

### 5. **Assinar Mensagens**
```javascript
import { signMessage } from '../utils/metamask';

const signature = await signMessage('Hello World', address);
```

### 6. **Event Listeners**
```javascript
import { onAccountsChanged, onChainChanged } from '../utils/metamask';

// Escuta mudanças de conta
const removeListener = onAccountsChanged((accounts) => {
  console.log('Conta mudou:', accounts[0]);
});

// Remove listener quando não precisar mais
removeListener();
```

---

## 🎯 Componentes Criados

### 1. **AddTokenButton**
Botão para adicionar o token CASS ao MetaMask com um clique.

```jsx
import AddTokenButton from '../components/AddTokenButton';

<AddTokenButton />
```

### 2. **NetworkSwitcher**
Componente para trocar entre redes suportadas.

```jsx
import NetworkSwitcher from '../components/NetworkSwitcher';

<NetworkSwitcher />
```

---

## 🌐 Redes Pré-configuradas

```javascript
import { NETWORKS } from '../utils/metamask';

// BSC Testnet
NETWORKS.BSC_TESTNET

// BSC Mainnet
NETWORKS.BSC_MAINNET

// Sepolia Testnet
NETWORKS.SEPOLIA

// Ethereum Mainnet
NETWORKS.ETHEREUM
```

---

## 📡 Métodos JSON-RPC Implementados

| Método | Descrição | Uso |
|--------|-----------|-----|
| `eth_requestAccounts` | Solicita acesso às contas | Conectar carteira |
| `eth_accounts` | Obtém contas conectadas | Verificar conexão |
| `eth_chainId` | Obtém chain ID atual | Detectar rede |
| `eth_getBalance` | Obtém saldo de ETH/BNB | Ver saldo nativo |
| `eth_sendTransaction` | Envia transação | Transferir, mint, etc |
| `personal_sign` | Assina mensagem | Autenticação |
| `wallet_switchEthereumChain` | Troca de rede | Mudar blockchain |
| `wallet_addEthereumChain` | Adiciona rede | Configurar nova rede |
| `wallet_watchAsset` | Adiciona token | Adicionar CASS |

---

## 🎭 Event Listeners Implementados

| Evento | Descrição | Quando Usar |
|--------|-----------|-------------|
| `accountsChanged` | Conta mudou | Atualizar UI |
| `chainChanged` | Rede mudou | Recarregar dados |
| `connect` | Provider conectou | Inicialização |
| `disconnect` | Provider desconectou | Erro de conexão |
| `message` | Mensagem recebida | Notificações |

---

## 🔧 Utilitários

### Conversão de Chain ID

```javascript
import { toHex, fromHex } from '../utils/metamask';

// Decimal para hexadecimal
toHex(97) // '0x61'

// Hexadecimal para decimal
fromHex('0x61') // 97
```

### Verificações

```javascript
import { 
  isMetaMaskInstalled, 
  isProviderConnected,
  isMetaMaskUnlocked 
} from '../utils/metamask';

// Verifica se MetaMask está instalado
if (isMetaMaskInstalled()) {
  // MetaMask disponível
}

// Verifica se está conectado à chain
if (isProviderConnected()) {
  // Pode fazer RPC requests
}

// Verifica se está desbloqueado
if (await isMetaMaskUnlocked()) {
  // Usuário fez login
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Conectar e Adicionar Token

```javascript
import { connectWallet } from '../utils/web3';
import { watchAsset } from '../utils/metamask';

async function setupWallet() {
  // 1. Conecta carteira
  const { address } = await connectWallet();
  
  // 2. Adiciona token CASS
  await watchAsset({
    address: '0x...',
    symbol: 'CASS',
    decimals: 18,
  });
  
  console.log('Tudo configurado!');
}
```

### Exemplo 2: Trocar para BSC Testnet

```javascript
import { switchChain, addChain, NETWORKS } from '../utils/metamask';

async function switchToBSCTestnet() {
  try {
    // Tenta trocar
    await switchChain(NETWORKS.BSC_TESTNET.chainId);
  } catch (error) {
    // Se não existe, adiciona
    if (error.message.includes('não está configurada')) {
      await addChain(NETWORKS.BSC_TESTNET);
    }
  }
}
```

### Exemplo 3: Escutar Mudanças

```javascript
import { onAccountsChanged, onChainChanged } from '../utils/metamask';

// Escuta mudanças de conta
onAccountsChanged((accounts) => {
  if (accounts.length === 0) {
    console.log('Desconectado');
  } else {
    console.log('Nova conta:', accounts[0]);
  }
});

// Escuta mudanças de rede
onChainChanged((chainId) => {
  console.log('Nova rede:', chainId);
  window.location.reload(); // Recarrega a página
});
```

---

## ⚠️ Tratamento de Erros

Todos os métodos tratam os erros comuns do MetaMask:

```javascript
try {
  await requestAccounts();
} catch (error) {
  if (error.code === 4001) {
    // Usuário rejeitou
  } else if (error.code === 4902) {
    // Rede não existe
  } else {
    // Outro erro
  }
}
```

### Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| 4001 | Usuário rejeitou a solicitação |
| 4100 | Método não autorizado |
| 4200 | Método não suportado |
| 4900 | Provider desconectado |
| 4902 | Chain não existe no MetaMask |

---

## 🚀 Uso na Aplicação

### Dashboard (`pages/index.js`)
- ✅ Botão "Adicionar ao MetaMask"
- ✅ Componente de troca de rede
- ✅ Detecção automática de rede

### Todas as Páginas
- ✅ Conexão automática se já autorizado
- ✅ Event listeners para mudanças
- ✅ Tratamento de erros amigável

---

## 📖 Referências

- [MetaMask Provider API](https://docs.metamask.io/wallet/reference/provider-api/)
- [JSON-RPC Methods](https://docs.metamask.io/wallet/reference/json-rpc-methods/)
- [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)
- [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963)

---

## ✅ Checklist de Implementação

- ✅ Provider API completa
- ✅ Todos os métodos JSON-RPC principais
- ✅ Event listeners
- ✅ Tratamento de erros
- ✅ Componentes React
- ✅ Redes pré-configuradas
- ✅ Utilitários de conversão
- ✅ Documentação completa
- ✅ Exemplos de uso

**Implementação 100% completa seguindo a documentação oficial do MetaMask!** 🎉
