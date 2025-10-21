# 🚀 Guia Rápido - CassoneCoin Dashboard

## ⚡ Início em 3 Passos

### 1️⃣ Configure o Contrato

Execute o script de configuração:

```powershell
.\setup.ps1
```

Ou crie manualmente o arquivo `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xSEU_ENDERECO_AQUI
NEXT_PUBLIC_CHAIN_ID=97
```

### 2️⃣ Inicie o Servidor

```powershell
npm run dev
```

### 3️⃣ Acesse e Use

1. Abra: http://localhost:3000
2. Conecte sua carteira MetaMask
3. Pronto! 🎉

---

## 🌐 Redes Suportadas

| Rede | Chain ID | Uso |
|------|----------|-----|
| Hardhat Local | 31337 | Desenvolvimento |
| BSC Testnet | 97 | Testes |
| BSC Mainnet | 56 | Produção |
| Sepolia | 11155111 | Testes Ethereum |
| Ethereum Mainnet | 1 | Produção Ethereum |

---

## 📱 Funcionalidades

### Dashboard (/)
- Ver supply total e máximo
- Ver seu saldo de CASS
- Progresso do supply
- Status do contrato

### Mintar (/mint)
- Criar novos tokens
- Apenas para o owner
- Respeita o cap de 10M

### Transferir (/transfer)
- Enviar CASS para outros
- Botão MAX para enviar tudo
- Validação de saldo

### Queimar (/burn)
- Destruir tokens permanentemente
- Reduz o supply total
- Preview antes de confirmar

### Admin (/admin)
- Pausar/despausar contrato
- Ver informações do owner
- Apenas para o owner

---

## 🔧 Solução de Problemas

### Erro: "Contrato não configurado"
✅ Crie o arquivo `.env.local` com o endereço do contrato

### Erro: "MetaMask não conectado"
✅ Instale o MetaMask e conecte sua carteira

### Erro: "Rede incorreta"
✅ Troque para a rede correta no MetaMask (BSC Testnet = 97)

### Transação falha
✅ Verifique se você tem BNB suficiente para gas
✅ Verifique se você é o owner (para mint/pause)

---

## 💡 Dicas

- **Sempre verifique** o endereço antes de transferir
- **Tenha BNB** na carteira para pagar gas fees
- **Backup** da sua private key em local seguro
- **Teste primeiro** na testnet antes de usar mainnet

---

## 📞 Suporte

Problemas? Verifique:
1. Console do navegador (F12)
2. Logs do terminal
3. Documentação do MetaMask
4. README.md principal

---

**Desenvolvido com ❤️ para CassoneCoin**
