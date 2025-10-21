# 🌐 CassoneCoin Dashboard

Interface web moderna para gerenciar o token CassoneCoin.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e adicione o endereço do seu contrato:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_seu_contrato_aqui
NEXT_PUBLIC_CHAIN_ID=31337
```

### 3. Rodar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 📱 Funcionalidades

- ✅ **Dashboard**: Visualize supply total, saldo, e estatísticas
- 🪙 **Mintar**: Crie novos tokens (apenas owner)
- 📤 **Transferir**: Envie tokens para outros endereços
- 🔥 **Queimar**: Destrua tokens permanentemente
- ⚙️ **Admin**: Pause/despause o contrato (apenas owner)

## 🛠️ Tecnologias

- **Next.js 14**: Framework React
- **Tailwind CSS**: Estilização
- **ethers.js**: Interação com blockchain
- **React Hot Toast**: Notificações

## 📦 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Verificar código
```

## 🔧 Configuração

### Redes Suportadas

- **Local (Hardhat)**: Chain ID 31337
- **Sepolia Testnet**: Chain ID 11155111
- **Ethereum Mainnet**: Chain ID 1

### MetaMask

Certifique-se de ter o MetaMask instalado e configurado com a rede correta.

## 📝 Estrutura

```
frontend/
├── src/
│   ├── pages/           # Páginas Next.js
│   ├── components/      # Componentes React
│   ├── utils/           # Utilitários (web3, contract, format)
│   └── styles/          # Estilos globais
├── public/              # Arquivos estáticos
└── package.json         # Dependências
```

## 🔒 Segurança

- ✅ Todas as transações são confirmadas via MetaMask
- ✅ Nenhuma chave privada é armazenada
- ✅ Código open source e auditável
- ✅ Validações client-side antes de enviar transações

## 📄 Licença

MIT
