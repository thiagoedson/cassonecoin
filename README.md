# CassoneCoin (CASS)

Um token ERC20 moderno e seguro implementado em Solidity para a blockchain Ethereum.

## Sobre o Projeto

CassoneCoin é um token ERC20 construído com os mais altos padrões de segurança, utilizando a biblioteca OpenZeppelin (v5.1.0). O token inclui funcionalidades básicas de transferência, aprovação e mintagem controlada pelo owner.

## Características

- **Padrão ERC20**: Totalmente compatível com o padrão ERC20
- **Seguro**: Baseado em OpenZeppelin Contracts (auditado e battle-tested)
- **Mintável**: Owner pode criar novos tokens (função mint)
- **Transferível**: Permite transferências entre endereços
- **Ownership**: Sistema de ownership com possibilidade de transferência ou renúncia

## Especificações Técnicas

- **Nome**: Cassone Coin
- **Símbolo**: CASS
- **Decimais**: 18 (padrão ERC20)
- **Solidity**: 0.8.26
- **Framework**: Hardhat
- **Bibliotecas**: OpenZeppelin Contracts v5.1.0

## Pré-requisitos

- Node.js v18+
- npm ou yarn
- Git

## Instalação

```bash
# Clone o repositório
git clone https://github.com/thiagoedson/cassonecoin.git
cd cassonecoin

# Instale as dependências
npm install
```

## Compilação

```bash
# Compilar os contratos
npx hardhat compile
```

## Testes

```bash
# Executar testes
npx hardhat test

# Executar testes com coverage
npx hardhat coverage

# Executar testes com gas reporter
REPORT_GAS=true npx hardhat test
```

## Deploy

### Deploy Local (Hardhat Network)

```bash
# Terminal 1: Iniciar node local
npx hardhat node

# Terminal 2: Deploy
npx hardhat ignition deploy ./ignition/modules/CassoneCoin.js --network localhost
```

### Deploy em Testnet (Sepolia)

1. Configure suas variáveis de ambiente em `.env`:
```env
PRIVATE_KEY=sua_chave_privada_aqui
INFURA_API_KEY=sua_api_key_infura
ETHERSCAN_API_KEY=sua_api_key_etherscan
```

2. Deploy:
```bash
npx hardhat ignition deploy ./ignition/modules/CassoneCoin.js --network sepolia
```

3. Verifique o contrato no Etherscan:
```bash
npx hardhat verify --network sepolia ENDEREÇO_DO_CONTRATO "1000000"
```

### Deploy em Mainnet

```bash
npx hardhat ignition deploy ./ignition/modules/CassoneCoin.js --network mainnet
```

**⚠️ ATENÇÃO**: Antes de fazer deploy em mainnet:
- Faça auditoria completa de segurança
- Teste extensivamente em testnet
- Verifique todas as configurações
- Tenha certeza do initial supply

## Uso do Token

### Interagindo via Hardhat Console

```javascript
// Conectar ao console
npx hardhat console --network localhost

// Pegar instância do contrato
const CassoneCoin = await ethers.getContractFactory("CassoneCoin");
const cassone = await CassoneCoin.attach("ENDEREÇO_DO_CONTRATO");

// Ver balance
const balance = await cassone.balanceOf("ENDEREÇO");
console.log(ethers.formatEther(balance));

// Transferir tokens
await cassone.transfer("ENDEREÇO_DESTINO", ethers.parseEther("100"));

// Mintar novos tokens (apenas owner)
await cassone.mint("ENDEREÇO_DESTINO", ethers.parseEther("1000"));

// Ver total supply
const supply = await cassone.totalSupply();
console.log(ethers.formatEther(supply));
```

### Interagindo via Script

Crie um arquivo `scripts/interact.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "ENDEREÇO_DO_CONTRATO";
  const cassone = await ethers.getContractAt("CassoneCoin", contractAddress);

  // Ver informações do token
  const name = await cassone.name();
  const symbol = await cassone.symbol();
  const totalSupply = await cassone.totalSupply();

  console.log("Token Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", ethers.formatEther(totalSupply), "CASS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Execute:
```bash
npx hardhat run scripts/interact.js --network localhost
```

### Usando com MetaMask

1. Adicione o token no MetaMask:
   - Clique em "Importar tokens"
   - Cole o endereço do contrato
   - O símbolo (CASS) e decimais (18) devem aparecer automaticamente

2. Agora você pode:
   - Ver seu saldo de CASS
   - Enviar CASS para outros endereços
   - Receber CASS

### Usando com Web3.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

const contractAddress = 'ENDEREÇO_DO_CONTRATO';
const abi = [...]; // ABI do contrato

const cassone = new web3.eth.Contract(abi, contractAddress);

// Ver balance
const balance = await cassone.methods.balanceOf('ENDEREÇO').call();

// Transferir (requer conta desbloqueada)
await cassone.methods.transfer('DESTINO', web3.utils.toWei('10', 'ether'))
  .send({ from: 'SEU_ENDEREÇO' });
```

### Usando com Ethers.js

```javascript
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
const contractAddress = 'ENDEREÇO_DO_CONTRATO';
const abi = [...]; // ABI do contrato

const cassone = new ethers.Contract(contractAddress, abi, provider);

// Ver balance
const balance = await cassone.balanceOf('ENDEREÇO');
console.log(ethers.formatEther(balance));

// Transferir (requer signer)
const wallet = new ethers.Wallet('PRIVATE_KEY', provider);
const cassoneWithSigner = cassone.connect(wallet);
await cassoneWithSigner.transfer('DESTINO', ethers.parseEther('10'));
```

## Funções do Contrato

### Funções ERC20 Padrão

| Função | Descrição | Acesso |
|--------|-----------|--------|
| `name()` | Retorna o nome do token | Público |
| `symbol()` | Retorna o símbolo do token | Público |
| `decimals()` | Retorna o número de decimais (18) | Público |
| `totalSupply()` | Retorna o supply total | Público |
| `balanceOf(address)` | Retorna o saldo de um endereço | Público |
| `transfer(address, uint256)` | Transfere tokens | Público |
| `approve(address, uint256)` | Aprova gasto de tokens | Público |
| `allowance(address, address)` | Verifica aprovação | Público |
| `transferFrom(address, address, uint256)` | Transfere de aprovação | Público |

### Funções Específicas do CassoneCoin

| Função | Descrição | Acesso |
|--------|-----------|--------|
| `mint(address, uint256)` | Cria novos tokens | Apenas Owner |
| `owner()` | Retorna o endereço do owner | Público |
| `transferOwnership(address)` | Transfere ownership | Apenas Owner |
| `renounceOwnership()` | Renuncia ownership | Apenas Owner |

## Eventos

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

## Estrutura do Projeto

```
cassonecoin/
├── contracts/
│   └── CassoneCoin.sol          # Contrato principal do token
├── test/
│   └── Lock.js                  # Testes (a serem atualizados)
├── ignition/modules/
│   └── Lock.js                  # Módulo de deploy (a ser atualizado)
├── hardhat.config.js            # Configuração do Hardhat
├── package.json                 # Dependências do projeto
├── flattened_CassoneCoin.sol    # Contrato flattened para verificação
├── README.md                    # Este arquivo
├── DEVELOPMENT_PLAN.md          # Plano de desenvolvimento inicial
└── ADJUSTMENTS_PLAN.md          # Plano de ajustes e melhorias
```

## Roadmap

### ✅ Versão 1.0 (Atual)
- [x] Token ERC20 básico
- [x] Função de mintagem
- [x] Sistema de ownership
- [x] Contrato deployável

### 🔄 Versão 1.1 (Em Desenvolvimento)
- [ ] Testes completos do token
- [ ] Módulo de deploy específico
- [ ] Scripts de interação
- [ ] Documentação expandida

### 📋 Versão 2.0 (Planejado)
- [ ] Cap máximo de supply
- [ ] Função burn (queima de tokens)
- [ ] Pause/Unpause em emergências
- [ ] Sistema de snapshot
- [ ] Auditoria de segurança

### 💡 Versão 3.0 (Futuro)
- [ ] Sistema de vesting
- [ ] Staking com recompensas
- [ ] Governança descentralizada (DAO)
- [ ] Anti-bot/Anti-whale
- [ ] Frontend Web3

## Segurança

### Práticas Implementadas
- ✅ Usa OpenZeppelin (biblioteca auditada)
- ✅ Solidity 0.8.26 (proteção contra overflow)
- ✅ Modifier onlyOwner para funções críticas
- ✅ Eventos para todas mudanças de estado importantes

### Recomendações
- 🔐 Mantenha sua private key segura
- 🔐 Use hardware wallet para owner em produção
- 🔐 Considere multi-sig wallet para ownership
- 🔐 Faça auditoria antes de mainnet
- 🔐 Teste extensivamente em testnet

### Reportando Vulnerabilidades
Se você encontrar uma vulnerabilidade de segurança:
1. **NÃO** abra uma issue pública
2. Envie email para: security@cassonecoin.org
3. Aguarde nossa resposta antes de divulgar

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Escreva testes para novas funcionalidades
- Mantenha o código limpo e documentado
- Siga as convenções de código do projeto
- Atualize a documentação quando necessário

## Scripts Úteis

```bash
# Desenvolvimento
npm run compile          # Compilar contratos
npm run test            # Executar testes
npm run coverage        # Coverage dos testes
npm run flatten         # Gerar arquivo flattened

# Deploy
npm run deploy:local    # Deploy local
npm run deploy:sepolia  # Deploy Sepolia
npm run deploy:mainnet  # Deploy Mainnet

# Utilidades
npm run clean           # Limpar artifacts
npm run node            # Iniciar node local
```

## FAQ

**Q: Qual o supply total de CassoneCoin?**
A: O supply inicial é definido no deploy (padrão: 1.000.000 CASS). Novos tokens podem ser mintados pelo owner.

**Q: Posso queimar (burn) tokens?**
A: Atualmente não, mas está planejado para a versão 2.0.

**Q: O contrato foi auditado?**
A: Usa OpenZeppelin que é auditado. Auditoria específica do projeto está planejada.

**Q: Em quais redes o token está disponível?**
A: Pode ser deployado em qualquer rede compatível com EVM (Ethereum, Polygon, BSC, etc.).

**Q: Como obter CASS?**
A: Depende do objetivo do projeto. Pode ser via:
- Distribuição inicial (airdrop)
- Venda pública (ICO/IDO)
- Exchanges (quando listado)
- Liquidity pools (DEX)

**Q: O ownership pode ser removido?**
A: Sim, o owner pode renunciar ao ownership chamando `renounceOwnership()`, tornando o contrato imutável.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Links Úteis

- **GitHub**: https://github.com/thiagoedson/cassonecoin
- **Issues**: https://github.com/thiagoedson/cassonecoin/issues
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin**: https://docs.openzeppelin.com/contracts
- **ERC20 Spec**: https://eips.ethereum.org/EIPS/eip-20

## Contato

- **Email**: contato@cassonecoin.org
- **GitHub**: [@thiagoedson](https://github.com/thiagoedson)

---

**Desenvolvido com OpenZeppelin e Hardhat**

*Este é um projeto open source. Contribuições e feedback são sempre bem-vindos!*
