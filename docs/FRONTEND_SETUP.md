# 🌐 Frontend Setup - CassoneCoin Dashboard

## 📋 Resumo

Criei a estrutura base para um **Dashboard Web completo** do CassoneCoin com:

### ✅ Funcionalidades Principais

1. **Dashboard Analytics**
   - Supply total e disponível
   - Número de holders
   - Histórico de transações
   - Gráficos em tempo real
   - Estatísticas do token

2. **Wallet Integration**
   - Conectar via MetaMask
   - Ver saldo de CASS
   - Histórico de transações pessoais

3. **Transfer Page**
   - Enviar CASS para qualquer endereço
   - Validação de formulário
   - Confirmação visual

4. **Admin Panel** (apenas para owner)
   - Mintar novos tokens
   - Queimar tokens
   - Pausar/Despausar contrato
   - Transferir ownership

5. **Recursos Visuais**
   - Design moderno com Tailwind CSS
   - Gráficos interativos (Recharts)
   - Notificações (React Hot Toast)
   - Responsivo (mobile-first)
   - Dark mode

## 🚀 Como Usar

### Instalação

```bash
cd frontend
npm install
```

### Configuração

Crie `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_seu_contrato_aqui
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://localhost:8545
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### Build para Produção

```bash
npm run build
npm start
```

## 📂 Estrutura

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.tsx          # Dashboard principal
│   │   ├── transfer.tsx       # Página de transferência
│   │   ├── admin.tsx          # Painel administrativo
│   │   └── _app.tsx           # App wrapper
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.tsx      # Card de estatísticas
│   │   │   ├── SupplyChart.tsx    # Gráfico de supply
│   │   │   ├── HoldersTable.tsx   # Tabela de holders
│   │   │   └── RecentTx.tsx       # Transações recentes
│   │   ├── Layout/
│   │   │   ├── Header.tsx         # Cabeçalho
│   │   │   ├── Sidebar.tsx        # Menu lateral
│   │   │   └── Footer.tsx         # Rodapé
│   │   ├── Forms/
│   │   │   ├── TransferForm.tsx   # Formulário de transferência
│   │   │   ├── MintForm.tsx       # Formulário de mintagem
│   │   │   └── BurnForm.tsx       # Formulário de queima
│   │   └── Web3/
│   │       ├── ConnectButton.tsx  # Botão conectar carteira
│   │       └── AccountInfo.tsx    # Info da conta
│   ├── hooks/
│   │   ├── useContract.ts         # Hook para contrato
│   │   ├── useTokenInfo.ts        # Hook info do token
│   │   └── useTransactions.ts     # Hook transações
│   ├── utils/
│   │   ├── contracts.ts           # ABI e endereços
│   │   ├── format.ts              # Formatação de números
│   │   └── constants.ts           # Constantes
│   └── styles/
│       └── globals.css            # Estilos globais
├── public/
│   ├── logo.svg
│   └── favicon.ico
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Páginas

### 1. Dashboard (/)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  Header [Logo] [Connect Wallet]                │
├─────────────────────────────────────────────────┤
│  📊 Stats Cards                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Supply│ │ Cap  │ │Holders│ │Price│           │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│                                                  │
│  📈 Supply Chart                                │
│  ┌──────────────────────────────────────┐      │
│  │  [Interactive Line Chart]            │      │
│  └──────────────────────────────────────┘      │
│                                                  │
│  🔥 Recent Transactions                         │
│  ┌──────────────────────────────────────┐      │
│  │  From → To | Amount | Time           │      │
│  │  0x123... → 0x456... | 1000 CASS    │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

### 2. Transfer (/transfer)

**Funcionalidades:**
- Input de endereço destino
- Input de quantidade
- Validação em tempo real
- Preview da transação
- Confirmação
- Feedback visual

### 3. Admin (/admin)

**Requer**: Ser o owner do contrato

**Seções:**
- Mint Tokens
- Burn Tokens
- Pause/Unpause
- Transfer Ownership
- Logs de ações

## 🔌 Integração Web3

### Wagmi + RainbowKit

Usar para:
- Conectar carteira
- Ler dados do contrato
- Enviar transações
- Gerenciar estado

### Exemplo de Hook

```typescript
import { useContractRead } from 'wagmi'

export function useTokenBalance(address: string) {
  const { data, isLoading } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CassoneCoinABI,
    functionName: 'balanceOf',
    args: [address],
  })

  return {
    balance: data,
    isLoading
  }
}
```

## 📊 Analytics

### Métricas Disponíveis

1. **Supply Metrics**
   - Total Supply
   - Circulating Supply
   - Burned Amount
   - Available to Mint

2. **Distribution**
   - Top Holders (Top 10)
   - Distribution Chart
   - Gini Coefficient

3. **Activity**
   - Transactions 24h
   - Volume 24h
   - Active Addresses
   - Burn Rate

4. **Price** (se aplicável)
   - Current Price
   - Market Cap
   - Volume
   - Price Change %

## 🎯 Componentes Principais

### StatsCard

```tsx
<StatsCard
  title="Total Supply"
  value="1,000,000 CASS"
  change="+5.2%"
  icon={TrendingUp}
/>
```

### SupplyChart

```tsx
<SupplyChart
  data={supplyHistory}
  period="7d"
/>
```

### TransferForm

```tsx
<TransferForm
  onSuccess={() => toast.success('Transfer successful!')}
/>
```

## 🔐 Segurança

- Validação de inputs
- Verificação de ownership
- Confirmação dupla para ações críticas
- Rate limiting
- Error handling robusto

## 📱 Responsivo

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🎨 Design System

### Cores

```
Primary: #6366f1 (Indigo)
Secondary: #8b5cf6 (Purple)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Error: #ef4444 (Red)
```

### Typography

```
Heading: Inter Bold
Body: Inter Regular
Mono: JetBrains Mono
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Próximas Melhorias

- [ ] Adicionar suporte multi-idioma (i18n)
- [ ] Implementar dark/light mode toggle
- [ ] Adicionar notificações em tempo real (WebSocket)
- [ ] Criar API própria para analytics
- [ ] Integrar com The Graph para indexação
- [ ] Adicionar export de dados (CSV/PDF)
- [ ] Implementar sistema de governance
- [ ] Criar mobile app (React Native)

## 💡 Dicas

1. **Performance**: Use React.memo() para componentes pesados
2. **SEO**: Configure meta tags em _app.tsx
3. **Analytics**: Integre Google Analytics ou Plausible
4. **Monitoring**: Use Sentry para error tracking
5. **Caching**: Configure SWR ou React Query

## 📖 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Wagmi Docs](https://wagmi.sh/)
- [RainbowKit Docs](https://www.rainbowkit.com/docs/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/)

---

**Pronto para começar? Execute `npm install` e `npm run dev`!** 🚀
