# 🎓 Guia Completo do CassoneCoin - Para Iniciantes

## 📚 Índice
1. [O que é o CassoneCoin?](#o-que-é-o-cassonecoin)
2. [Como Funciona?](#como-funciona)
3. [Como Ver Suas Moedas](#como-ver-suas-moedas)
4. [Como Gerar Mais Moedas](#como-gerar-mais-moedas)
5. [Como Usar as Moedas](#como-usar-as-moedas)
6. [Conceitos Importantes](#conceitos-importantes)
7. [Exemplos Práticos](#exemplos-práticos)

---

## 🪙 O que é o CassoneCoin?

### Explicação Simples

**CassoneCoin (CASS)** é um **token digital** que você criou. Pense nele como uma moeda virtual, tipo o Bitcoin, mas você é o dono e controla tudo!

### O que NÃO é

❌ **NÃO** é uma blockchain própria (como Bitcoin ou Ethereum)
❌ **NÃO** precisa de mineração

### O que É

✅ É um **token ERC20** que roda na blockchain Ethereum
✅ É como criar uma moeda dentro do Ethereum
✅ Você controla quem recebe, quanto existe, etc.

---

## 🔧 Como Funciona?

### 1. **Blockchain Ethereum**
```
Pense no Ethereum como um "banco mundial digital"
│
├─ Você pode criar sua própria moeda dentro dele
├─ Essa moeda é chamada de "Token ERC20"
└─ CassoneCoin é esse token!
```

### 2. **Seu Token**
```
CassoneCoin (CASS)
│
├─ Nome: Cassone Coin
├─ Símbolo: CASS (tipo BTC pro Bitcoin)
├─ Supply Máximo: 10.000.000 CASS
├─ Decimais: 18 (pode dividir em partes minúsculas)
└─ Owner: VOCÊ (quem fez o deploy)
```

### 3. **O Que Você Pode Fazer (Como Owner)**

✅ **Mintar (Criar)** novas moedas até o limite de 10 milhões
✅ **Pausar** todas as transferências (emergência)
✅ **Transferir** o controle (ownership) para outra pessoa
✅ **Renunciar** ao controle (deixar o token "livre")

### 4. **O Que QUALQUER PESSOA Pode Fazer**

✅ **Transferir** CASS para outros endereços
✅ **Queimar (Burn)** seus próprios tokens
✅ **Aprovar** outros gastarem seus tokens
✅ **Ver** saldos e transações

---

## 👀 Como Ver Suas Moedas

### Opção 1: Via Hardhat (Desenvolvimento Local)

```bash
# 1. Inicie o node local
npm run node

# 2. Em outro terminal, faça deploy
npm run deploy:local
# Anote o endereço do contrato que aparecer!

# 3. Abra o console
npm run console -- --network localhost

# 4. No console, cole isso (substitua o ENDEREÇO):
const cassone = await ethers.getContractAt("CassoneCoin", "ENDEREÇO_DO_CONTRATO")

# 5. Ver seu saldo:
const saldo = await cassone.balanceOf("SEU_ENDEREÇO_ETHEREUM")
console.log(ethers.formatEther(saldo)) // Mostra quantos CASS você tem

# 6. Ver supply total:
const total = await cassone.totalSupply()
console.log(ethers.formatEther(total)) // Total de CASS que existe
```

### Opção 2: Via MetaMask (Depois de fazer deploy)

```
1. Faça deploy na rede Sepolia (testnet):
   npm run deploy:sepolia

2. Copie o endereço do contrato

3. Abra MetaMask:
   - Clique em "Importar tokens"
   - Cole o endereço do contrato
   - Símbolo: CASS
   - Decimais: 18

4. Pronto! Você verá seus CASS no MetaMask
```

### Opção 3: Via Etherscan (Blockchain Explorer)

```
1. Acesse: https://sepolia.etherscan.io/ (testnet)
   ou https://etherscan.io/ (mainnet)

2. Cole o endereço do contrato

3. Você verá:
   - Total supply
   - Holders (quem tem tokens)
   - Todas as transações
   - Etc.
```

---

## ⚡ Como Gerar Mais Moedas

### Conceito: MINTAGEM (Mint)

**Mintar** = Criar novas moedas do nada (como imprimir dinheiro)

**IMPORTANTE:** Só o OWNER pode mintar!

### Passo a Passo para Mintar

#### Via Hardhat Console

```javascript
// 1. Conecte ao contrato
const cassone = await ethers.getContractAt("CassoneCoin", "ENDEREÇO_DO_CONTRATO")

// 2. Minte 1000 CASS para alguém
await cassone.mint("ENDEREÇO_DESTINO", ethers.parseEther("1000"))

// 3. Verifique
const saldo = await cassone.balanceOf("ENDEREÇO_DESTINO")
console.log(ethers.formatEther(saldo)) // Deve mostrar 1000
```

#### Via Script

Crie um arquivo `scripts/mint.js`:

```javascript
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "ENDEREÇO_DO_CONTRATO";
  const cassone = await ethers.getContractAt("CassoneCoin", contractAddress);

  // Minta 5000 CASS
  const amount = ethers.parseEther("5000");
  const recipient = "ENDEREÇO_DESTINO";

  console.log(`Mintando ${ethers.formatEther(amount)} CASS para ${recipient}...`);
  const tx = await cassone.mint(recipient, amount);
  await tx.wait();

  console.log("Mintagem completa!");
  console.log("Transaction hash:", tx.hash);

  // Verificar novo supply
  const totalSupply = await cassone.totalSupply();
  console.log("Supply total:", ethers.formatEther(totalSupply), "CASS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Execute:
```bash
npx hardhat run scripts/mint.js --network localhost
```

### Limites da Mintagem

```
❌ NÃO pode mintar mais de 10.000.000 CASS (supply máximo)
❌ NÃO pode mintar se não for o owner
❌ NÃO pode mintar se o contrato estiver pausado
```

---

## 💸 Como Usar as Moedas

### 1. **Transferir CASS**

#### Via Hardhat Console
```javascript
const cassone = await ethers.getContractAt("CassoneCoin", "ENDEREÇO")

// Transferir 100 CASS
await cassone.transfer("ENDEREÇO_DESTINO", ethers.parseEther("100"))
```

#### Via MetaMask
```
1. Abra MetaMask
2. Selecione CASS
3. Clique em "Enviar"
4. Cole o endereço destino
5. Digite a quantidade
6. Confirme
```

### 2. **Queimar CASS (Burn)**

**Queimar** = Destruir tokens permanentemente (reduz o supply)

```javascript
// Queimar 500 CASS seus
await cassone.burn(ethers.parseEther("500"))

// Depois de queimar, esses tokens NUNCA mais existem!
```

**Por que queimar?**
- Reduzir o supply total (fazer o token mais raro)
- Remover tokens indesejados
- Estratégia deflacionária

### 3. **Aprovar Gastos (Allowance)**

Permite outra pessoa gastar seus tokens:

```javascript
// Aprovar 1000 CASS para alguém gastar
await cassone.approve("ENDEREÇO_APROVADO", ethers.parseEther("1000"))

// Agora essa pessoa pode transferir seus CASS (até 1000)
```

### 4. **Pausar Tudo (Emergência)**

Se algo der errado, você pode pausar TUDO:

```javascript
// Pausar (só owner)
await cassone.pause()

// Ninguém pode transferir, mintar ou queimar!

// Despausar
await cassone.unpause()
```

---

## 🎯 Conceitos Importantes

### Wei vs Ether

```javascript
// Ethereum usa "wei" internamente
// 1 CASS = 1.000.000.000.000.000.000 wei (18 zeros)

// Para converter:
ethers.parseEther("100")    // 100 CASS → wei
ethers.formatEther(wei)     // wei → CASS legível
```

### Gas (Taxa)

- Toda operação na blockchain custa **Gas**
- Gas é pago em **ETH** (Ethereum)
- Você precisa ter ETH na carteira para pagar gas
- Mintagem, transferências, etc. custam gas

### Endereços Ethereum

```
Formato: 0x1234567890abcdef...
Exemplo: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

- Sempre começa com 0x
- Tem 42 caracteres
- Case-sensitive (maiúsculas importam)
```

### Supply Total vs Saldo

```
Supply Total: Quantos CASS existem no mundo todo
Seu Saldo: Quantos CASS VOCÊ tem
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Criar e Distribuir Tokens

```javascript
// 1. Deploy (já cria 1.000.000 CASS para você)
npm run deploy:local

// 2. Distribuir para time
await cassone.transfer("0xEndereçoMembro1", ethers.parseEther("10000"))
await cassone.transfer("0xEndereçoMembro2", ethers.parseEther("10000"))
await cassone.transfer("0xEndereçoMembro3", ethers.parseEther("10000"))

// 3. Mintar mais se precisar
await cassone.mint(owner.address, ethers.parseEther("50000"))
```

### Exemplo 2: Vender Tokens

```javascript
// 1. Alguém te paga (via PIX, PayPal, etc.)

// 2. Você envia CASS pra pessoa
await cassone.transfer("0xEndereçoComprador", ethers.parseEther("1000"))

// Pronto! A pessoa recebeu 1000 CASS
```

### Exemplo 3: Airdrop (Distribuição Grátis)

```javascript
// Lista de endereços
const recipients = [
  "0xEndereço1",
  "0xEndereço2",
  "0xEndereço3"
];

// Enviar 100 CASS para cada
for (const recipient of recipients) {
  await cassone.transfer(recipient, ethers.parseEther("100"));
  console.log(`Enviado para ${recipient}`);
}
```

### Exemplo 4: Fazer Token Mais Raro

```javascript
// Ver supply atual
const supply = await cassone.totalSupply()
console.log(ethers.formatEther(supply)) // Ex: 1000000

// Queimar 200.000 CASS
await cassone.burn(ethers.parseEther("200000"))

// Supply agora é 800.000 (mais raro!)
```

### Exemplo 5: Emergência

```javascript
// Detectou um problema?
await cassone.pause()
console.log("Token pausado! Ninguém pode transferir")

// Resolveu o problema?
await cassone.unpause()
console.log("Token despausado! Voltou ao normal")
```

---

## 🚀 Próximos Passos

### Para Testar

1. **Deploy Local**
   ```bash
   npm install
   npm run node
   npm run deploy:local
   ```

2. **Rodar Testes**
   ```bash
   npm run test
   ```

3. **Deploy em Testnet (Sepolia)**
   - Configure `.env` com sua private key
   - Pegue ETH grátis: https://sepoliafaucet.com/
   - `npm run deploy:sepolia`

### Para Produção (CUIDADO!)

1. **Auditoria de Segurança** (recomendado)
2. **Testes extensivos em testnet**
3. **Deploy em Mainnet**: `npm run deploy:mainnet`
4. **Verificar contrato**: `npm run verify:mainnet`

---

## ❓ FAQ Rápido

**P: Preciso pagar para criar o token?**
R: Sim, precisa pagar GAS em ETH para fazer deploy na blockchain.

**P: Posso criar tokens infinitos?**
R: Não! Máximo de 10.000.000 CASS.

**P: Se eu queimar tokens, posso recuperar?**
R: NÃO! Queimar é permanente.

**P: Preciso de servidor para rodar?**
R: Não! Uma vez na blockchain, roda sozinho.

**P: Quanto custa usar meu token?**
R: Depende do gas do Ethereum. Em testnet é grátis.

**P: Posso vender meus tokens?**
R: Sim! Você pode vender, trocar, dar, etc.

**P: O que acontece se eu perder a private key?**
R: Perde o controle! NUNCA compartilhe a private key.

**P: Posso usar em outras blockchains?**
R: Pode fazer deploy em qualquer blockchain compatível com EVM (Polygon, BSC, etc.)

---

## 🛠️ Comandos Rápidos

```bash
# Desenvolvimento
npm install          # Instalar dependências
npm run compile      # Compilar contrato
npm run test         # Rodar testes
npm run node         # Iniciar node local

# Deploy
npm run deploy:local     # Deploy local
npm run deploy:sepolia   # Deploy testnet
npm run deploy:mainnet   # Deploy mainnet (PRODUÇÃO)

# Interação
npm run console      # Abrir console
```

---

## 📞 Precisa de Ajuda?

- Documentação Hardhat: https://hardhat.org/docs
- Documentação OpenZeppelin: https://docs.openzeppelin.com/
- Ethereum: https://ethereum.org/pt/developers/
- Solidity: https://docs.soliditylang.org/

---

**Desenvolvido por você! Parabéns por criar seu próprio token! 🎉**
