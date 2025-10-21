# CassoneCoin

Uma criptomoeda moderna e eficiente construída com foco em segurança, velocidade e descentralização.

## Sobre o Projeto

CassoneCoin é uma implementação de blockchain que visa fornecer uma alternativa rápida, segura e escalável para transações digitais. O projeto foi desenvolvido com as melhores práticas de segurança e arquitetura blockchain moderna.

## Características Principais

- **Descentralização**: Rede peer-to-peer totalmente distribuída
- **Segurança**: Algoritmo de consenso robusto com criptografia de ponta
- **Velocidade**: Confirmação rápida de transações
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Transparência**: Todas as transações são públicas e verificáveis
- **Open Source**: Código aberto e auditável

## Especificações Técnicas

### Blockchain
- **Algoritmo de Consenso**: Proof of Work (PoW)
- **Tempo de Bloco**: ~10 minutos
- **Recompensa por Bloco**: 50 CASSONE (com halving a cada 210.000 blocos)
- **Suprimento Máximo**: 21.000.000 CASSONE
- **Dificuldade**: Ajuste automático a cada 2016 blocos

### Criptografia
- **Hash de Bloco**: SHA-256
- **Assinatura de Transações**: ECDSA (Elliptic Curve Digital Signature Algorithm)
- **Endereços**: Base58Check encoding

## Como Usar a Moeda

### Instalação

#### Pré-requisitos
```bash
# Para compilar do código fonte, você precisará de:
- Git
- Compilador C++ (GCC 7+ ou Clang 5+)
- CMake 3.10+
- Bibliotecas: OpenSSL, Boost, libevent
```

#### Instalação a partir do código fonte
```bash
# Clone o repositório
git clone https://github.com/thiagoedson/cassonecoin.git
cd cassonecoin

# Compile o projeto
mkdir build && cd build
cmake ..
make -j$(nproc)

# Instale (opcional)
sudo make install
```

#### Instalação via binários pré-compilados
```bash
# Download da última versão
wget https://github.com/thiagoedson/cassonecoin/releases/latest/download/cassonecoin-linux-x64.tar.gz

# Extraia os arquivos
tar -xzf cassonecoin-linux-x64.tar.gz

# Torne executável
chmod +x cassonecoin-*
```

### Iniciando o Node

#### Modo Full Node
```bash
# Inicie o daemon da blockchain
./cassonecoind

# Ou com arquivo de configuração customizado
./cassonecoind -conf=/path/to/cassonecoin.conf
```

#### Configuração Básica
Crie um arquivo `cassonecoin.conf` em `~/.cassonecoin/`:

```conf
# Configurações de rede
listen=1
maxconnections=125

# Configurações RPC (para usar a wallet)
server=1
rpcuser=seu_usuario
rpcpassword=sua_senha_segura
rpcport=8332

# Configurações de mineração (opcional)
gen=0  # Mude para 1 para minerar
genproclimit=1  # Número de cores para mineração
```

### Usando a Carteira (Wallet)

#### Criar uma nova carteira
```bash
./cassonecoin-cli createwallet "minha_carteira"
```

#### Gerar um novo endereço
```bash
./cassonecoin-cli getnewaddress
```

#### Verificar saldo
```bash
./cassonecoin-cli getbalance
```

#### Enviar CassoneCoin
```bash
./cassonecoin-cli sendtoaddress "endereco_destino" 10.0
```

#### Listar transações
```bash
./cassonecoin-cli listtransactions
```

#### Verificar informações da blockchain
```bash
# Ver informações do bloco atual
./cassonecoin-cli getblockchaininfo

# Ver informações da rede
./cassonecoin-cli getnetworkinfo

# Ver conexões ativas
./cassonecoin-cli getpeerinfo
```

### Mineração

#### Começar a minerar
```bash
# Via linha de comando
./cassonecoin-cli setgenerate true 2  # 2 = número de threads

# Parar mineração
./cassonecoin-cli setgenerate false
```

#### Verificar status da mineração
```bash
./cassonecoin-cli getmininginfo
```

## API RPC

CassoneCoin fornece uma API JSON-RPC completa para integração:

```bash
# Exemplo usando curl
curl --user seu_usuario:sua_senha \
  --data-binary '{"jsonrpc":"1.0","id":"curltest","method":"getblockcount","params":[]}' \
  -H 'content-type: text/plain;' \
  http://127.0.0.1:8332/
```

### Principais Comandos RPC

| Comando | Descrição |
|---------|-----------|
| `getblockcount` | Retorna a altura atual da blockchain |
| `getbestblockhash` | Retorna o hash do último bloco |
| `getblock` | Retorna informações sobre um bloco específico |
| `gettransaction` | Retorna detalhes de uma transação |
| `sendtoaddress` | Envia moedas para um endereço |
| `getbalance` | Retorna o saldo da carteira |
| `listunspent` | Lista outputs não gastos (UTXOs) |

## Desenvolvimento

### Estrutura do Projeto
```
cassonecoin/
├── src/               # Código fonte principal
│   ├── blockchain/    # Implementação da blockchain
│   ├── consensus/     # Algoritmos de consenso
│   ├── crypto/        # Funções criptográficas
│   ├── network/       # Camada de rede P2P
│   ├── wallet/        # Implementação da carteira
│   └── rpc/           # Servidor RPC
├── tests/             # Testes unitários e de integração
├── docs/              # Documentação adicional
└── scripts/           # Scripts auxiliares
```

### Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Executando Testes
```bash
cd build
make test

# Ou executar testes específicos
./tests/test_blockchain
./tests/test_wallet
```

## Segurança

### Boas Práticas

- **Backup da Carteira**: Sempre faça backup do arquivo `wallet.dat`
- **Senha Forte**: Use senhas fortes para RPC e criptografia da carteira
- **Firewall**: Configure firewall para proteger a porta RPC (8332)
- **Atualizações**: Mantenha o software sempre atualizado
- **Cold Storage**: Para grandes quantias, considere cold wallets

### Reportando Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança, por favor NÃO abra uma issue pública. Envie um email para: security@cassonecoin.org

## Roadmap

### Versão 1.0 (Atual - Em Desenvolvimento)
- [x] Implementação básica da blockchain
- [x] Sistema de carteira
- [ ] Rede P2P completa
- [ ] Interface gráfica (GUI)
- [ ] Documentação completa

### Versão 2.0 (Futuro)
- [ ] Lightning Network para transações instantâneas
- [ ] Smart Contracts básicos
- [ ] Melhorias de privacidade (transações confidenciais)
- [ ] Mobile wallets (iOS/Android)
- [ ] Suporte a hardware wallets

### Versão 3.0 (Longo Prazo)
- [ ] Sharding para escalabilidade
- [ ] Cross-chain interoperability
- [ ] Governança descentralizada
- [ ] Zero-knowledge proofs

## Recursos

- **Website**: https://cassonecoin.org (em breve)
- **Documentação**: https://docs.cassonecoin.org (em breve)
- **Explorer**: https://explorer.cassonecoin.org (em breve)
- **Fórum**: https://forum.cassonecoin.org (em breve)
- **Discord**: Link em breve
- **Twitter**: @CassoneCoin

## FAQ

### Como obter CassoneCoin?
Você pode obter CassoneCoin de três formas:
1. Minerando (rodando um node de mineração)
2. Comprando em exchanges (quando listado)
3. Recebendo de outros usuários

### Qual a diferença entre CassoneCoin e Bitcoin?
CassoneCoin mantém os princípios fundamentais do Bitcoin mas com otimizações modernas e foco em casos de uso específicos.

### É necessário baixar toda a blockchain?
Sim, para rodar um full node. Alternativamente, você pode usar SPV (Simplified Payment Verification) wallets que são mais leves.

### Quanto tempo leva para sincronizar?
Depende da sua conexão de internet e hardware. Inicialmente pode levar algumas horas para sincronizar toda a blockchain.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Aviso Legal

CassoneCoin é um projeto experimental e educacional. Use por sua conta e risco. Cryptocurrency é volátil e pode resultar em perdas financeiras. Nunca invista mais do que você pode perder.

## Contato

- **Email**: contato@cassonecoin.org
- **GitHub**: https://github.com/thiagoedson/cassonecoin
- **Issues**: https://github.com/thiagoedson/cassonecoin/issues

---

**Desenvolvido com dedicação pela comunidade CassoneCoin**

*Este projeto é open source e mantido pela comunidade. Contribuições são sempre bem-vindas!*
