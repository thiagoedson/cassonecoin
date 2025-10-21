# Plano de Ajustes - CassoneCoin

## Análise do Projeto Atual

### Situação Atual
CassoneCoin é um **token ERC20** implementado em Solidity para a blockchain Ethereum usando:
- **Padrão**: ERC20 (OpenZeppelin v5.1.0)
- **Nome**: Cassone Coin
- **Símbolo**: CASS
- **Solidity**: 0.8.26
- **Framework**: Hardhat
- **Funcionalidades**: Token básico + mintagem pelo owner

### Arquitetura Atual
```
cassonecoin/
├── contracts/
│   └── CassoneCoin.sol          ✅ Implementado (básico)
├── test/
│   └── Lock.js                  ❌ Teste do template, não do token
├── ignition/modules/
│   └── Lock.js                  ❌ Deploy do template, não do token
├── hardhat.config.js            ⚠️ Configuração mínima
├── package.json                 ⚠️ Faltam scripts úteis
├── README.md                    ❌ Desatualizado (template Hardhat)
└── flattened_CassoneCoin.sol    ✅ Contrato flattened para verificação
```

## Problemas Identificados

### 1. **Críticos** (Impedem uso adequado)
- [ ] README não explica o projeto real
- [ ] Sem testes para o contrato CassoneCoin
- [ ] Sem módulo de deploy para CassoneCoin
- [ ] Scripts de desenvolvimento faltando

### 2. **Importantes** (Segurança e Funcionalidades)
- [ ] Supply ilimitado (sem cap máximo)
- [ ] Sem função burn (destruir tokens)
- [ ] Sem mecanismo de pause/unpause
- [ ] Sem proteção contra bots/whales
- [ ] Configuração Hardhat incompleta

### 3. **Desejáveis** (Melhorias)
- [ ] Documentação de API do contrato
- [ ] Scripts de deploy para diferentes redes
- [ ] Sistema de vesting/staking
- [ ] Governança descentralizada
- [ ] Integração com frontend (Web3)

## Plano de Ajustes

### FASE 1: Correções Essenciais (Prioridade ALTA)

#### 1.1. Atualizar README.md
**Arquivo**: `README.md`

Substituir conteúdo atual por documentação completa incluindo:
- O que é CassoneCoin (token ERC20)
- Como instalar dependências
- Como compilar o contrato
- Como fazer deploy
- Como interagir com o token
- Endereços de deploy (quando disponível)
- Como usar em carteiras (MetaMask)

**Tempo estimado**: 30 minutos

#### 1.2. Criar Testes para CassoneCoin
**Arquivo**: `test/CassoneCoin.test.js`

Testes a implementar:
```javascript
describe("CassoneCoin", function () {
  // Deployment
  ✓ Should deploy with correct name and symbol
  ✓ Should mint initial supply to deployer
  ✓ Should set correct owner

  // Minting
  ✓ Should allow owner to mint tokens
  ✓ Should not allow non-owner to mint
  ✓ Should update total supply after minting

  // Transfers
  ✓ Should transfer tokens between accounts
  ✓ Should fail when sender has insufficient balance
  ✓ Should emit Transfer event

  // Allowances
  ✓ Should approve tokens for spending
  ✓ Should transfer tokens using allowance
  ✓ Should emit Approval event

  // Owner functions
  ✓ Should transfer ownership
  ✓ Should renounce ownership
});
```

**Tempo estimado**: 1-2 horas

#### 1.3. Criar Módulo de Deploy
**Arquivo**: `ignition/modules/CassoneCoin.js`

```javascript
// Deploy com supply inicial configurável
const initialSupply = 1_000_000; // 1 milhão de tokens
```

**Tempo estimado**: 30 minutos

#### 1.4. Adicionar Scripts Úteis
**Arquivo**: `package.json`

Scripts a adicionar:
```json
{
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test",
    "test:coverage": "npx hardhat coverage",
    "deploy:localhost": "npx hardhat ignition deploy ./ignition/modules/CassoneCoin.js --network localhost",
    "deploy:sepolia": "npx hardhat ignition deploy ./ignition/modules/CassoneCoin.js --network sepolia",
    "verify:sepolia": "npx hardhat verify --network sepolia",
    "node": "npx hardhat node",
    "flatten": "npx hardhat flatten contracts/CassoneCoin.sol > flattened_CassoneCoin.sol",
    "clean": "npx hardhat clean"
  }
}
```

**Tempo estimado**: 15 minutos

#### 1.5. Melhorar Configuração Hardhat
**Arquivo**: `hardhat.config.js`

Adicionar:
- Configuração de redes (localhost, Sepolia, Ethereum mainnet)
- API keys (Etherscan, Infura/Alchemy)
- Gas reporter
- Coverage

**Tempo estimado**: 30 minutos

### FASE 2: Melhorias no Contrato (Prioridade MÉDIA)

#### 2.1. Adicionar Cap Máximo
**Arquivo**: `contracts/CassoneCoin.sol`

```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract CassoneCoin is ERC20, ERC20Capped, Ownable {
    constructor(uint256 initialSupply, uint256 cap)
        ERC20("Cassone Coin", "CASS")
        ERC20Capped(cap * 10 ** decimals())
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
```

**Benefício**: Previne inflação ilimitada

#### 2.2. Adicionar Função Burn
```solidity
function burn(uint256 amount) public {
    _burn(msg.sender, amount);
}

function burnFrom(address account, uint256 amount) public {
    _spendAllowance(account, msg.sender, amount);
    _burn(account, amount);
}
```

**Benefício**: Permite destruir tokens (deflação)

#### 2.3. Adicionar Pause/Unpause
```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

function pause() public onlyOwner {
    _pause();
}

function unpause() public onlyOwner {
    _unpause();
}
```

**Benefício**: Segurança em emergências

#### 2.4. Adicionar Snapshot
```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

function snapshot() public onlyOwner returns (uint256) {
    return _snapshot();
}
```

**Benefício**: Útil para airdrops e dividendos

**Tempo estimado (todas melhorias)**: 2-3 horas

### FASE 3: Recursos Avançados (Prioridade BAIXA)

#### 3.1. Sistema de Vesting
**Arquivo**: `contracts/TokenVesting.sol`

- Liberar tokens gradualmente ao longo do tempo
- Útil para equipe, investidores, advisors

#### 3.2. Staking
**Arquivo**: `contracts/Staking.sol`

- Permitir usuários travarem tokens
- Ganhar recompensas
- Incentivar holding de longo prazo

#### 3.3. Governança
**Arquivo**: `contracts/CassoneGovernor.sol`

- Sistema de votação on-chain
- Propostas de mudanças
- DAO (Decentralized Autonomous Organization)

#### 3.4. Anti-Bot/Anti-Whale
```solidity
// Limite por transação
uint256 public maxTransactionAmount;

// Cooldown entre transações
mapping(address => uint256) private _lastTransfer;
uint256 public transferCooldown = 30 seconds;

// Limite de holdings
uint256 public maxWalletAmount;
```

#### 3.5. Taxa de Transação (Opcional)
```solidity
// Taxa de 1% em transferências
uint256 public transferFee = 100; // 1% = 100 basis points

// Endereço que recebe as taxas
address public feeReceiver;
```

**Tempo estimado (todos recursos)**: 1-2 semanas

### FASE 4: Documentação e Deploy

#### 4.1. Documentação Completa
**Arquivos**:
- `docs/DEPLOYMENT.md` - Guia de deploy
- `docs/USAGE.md` - Como usar o token
- `docs/API.md` - Referência da API do contrato
- `docs/SECURITY.md` - Considerações de segurança

#### 4.2. Deploy em Testnet
**Rede**: Sepolia Testnet
- Deploy do contrato
- Verificação no Etherscan
- Testes de integração
- Documentar endereço do contrato

#### 4.3. Auditoria de Segurança
- Code review completo
- Testes de segurança
- Análise de vulnerabilidades
- Considerar auditoria profissional

#### 4.4. Deploy em Mainnet (quando pronto)
- Deploy na Ethereum Mainnet
- Verificação no Etherscan
- Renúncia de ownership (se aplicável)
- Anúncio público

**Tempo estimado**: 1 semana

## Resumo de Prioridades

### ⚡ Fazer AGORA (Essencial)
1. ✅ Atualizar README.md
2. ✅ Criar testes (CassoneCoin.test.js)
3. ✅ Criar módulo de deploy (ignition/modules/CassoneCoin.js)
4. ✅ Adicionar scripts úteis
5. ✅ Melhorar hardhat.config.js

### 🔥 Fazer em BREVE (Importante)
6. ⚠️ Adicionar cap máximo ao supply
7. ⚠️ Adicionar função burn
8. ⚠️ Adicionar pause/unpause
9. ⚠️ Deploy e teste em Sepolia

### 💡 Fazer DEPOIS (Opcional)
10. 💎 Sistema de vesting
11. 💎 Staking
12. 💎 Governança
13. 💎 Anti-bot/whale
14. 💎 Deploy em mainnet

## Estimativas de Tempo

| Fase | Descrição | Tempo Estimado |
|------|-----------|----------------|
| 1 | Correções Essenciais | 3-4 horas |
| 2 | Melhorias no Contrato | 2-3 horas |
| 3 | Recursos Avançados | 1-2 semanas |
| 4 | Documentação e Deploy | 1 semana |

**Total para MVP funcional (Fases 1+2)**: 1 dia de trabalho

## Configurações Recomendadas

### Initial Supply Sugerido
```
Initial Supply: 1,000,000 CASS
Max Supply (Cap): 10,000,000 CASS
Decimals: 18 (padrão ERC20)
```

### Distribuição Sugerida
```
Team/Founders: 20% (200,000 CASS) - com vesting de 2 anos
Public Sale: 30% (300,000 CASS)
Liquidity Pool: 25% (250,000 CASS)
Marketing: 10% (100,000 CASS)
Development: 10% (100,000 CASS)
Reserve: 5% (50,000 CASS)
```

## Decisões a Tomar

### 1. Supply do Token
- [ ] Qual o initial supply?
- [ ] Deve ter cap máximo? Qual valor?
- [ ] Será deflacionário (burn)?

### 2. Funcionalidades
- [ ] Precisa de pause/unpause?
- [ ] Precisa de snapshot?
- [ ] Precisa de vesting?
- [ ] Precisa de taxas de transferência?

### 3. Deploy
- [ ] Qual rede? (Ethereum, Polygon, BSC, Arbitrum, etc.)
- [ ] Quando fazer deploy em mainnet?
- [ ] Vai fazer auditoria profissional?

### 4. Governança
- [ ] Owner permanente ou renunciar ownership?
- [ ] Multi-sig wallet para owner?
- [ ] Sistema de governança descentralizado?

## Próximos Passos Recomendados

1. **Revisar este plano** e decidir prioridades
2. **Executar Fase 1** (correções essenciais)
3. **Testar tudo** localmente
4. **Decidir sobre melhorias** da Fase 2
5. **Deploy em Sepolia** para testes
6. **Planejar launch** (se aplicável)

---

**Criado em**: 2025-10-21
**Versão**: 1.0
**Status**: Aguardando Aprovação

**Pergunta**: Quer que eu comece a implementar a Fase 1 agora?
