# Script de configuração do frontend CassoneCoin

Write-Host "🪙 Configurando Frontend CassoneCoin..." -ForegroundColor Cyan
Write-Host ""

# Verifica se o arquivo .env.local já existe
if (Test-Path ".env.local") {
    Write-Host "⚠️  Arquivo .env.local já existe!" -ForegroundColor Yellow
    $resposta = Read-Host "Deseja sobrescrever? (s/n)"
    if ($resposta -ne "s") {
        Write-Host "❌ Configuração cancelada." -ForegroundColor Red
        exit
    }
}

# Solicita o endereço do contrato
Write-Host "📝 Digite o endereço do contrato CassoneCoin deployado:" -ForegroundColor Green
Write-Host "   (Exemplo: 0x5FbDB2315678afecb367f032d93F642f64180aa3)" -ForegroundColor Gray
$contratoEndereco = Read-Host "Endereço"

# Valida o endereço
if ($contratoEndereco -notmatch "^0x[a-fA-F0-9]{40}$") {
    Write-Host "❌ Endereço inválido! Deve começar com 0x e ter 42 caracteres." -ForegroundColor Red
    exit
}

# Solicita o Chain ID
Write-Host ""
Write-Host "🌐 Selecione a rede:" -ForegroundColor Green
Write-Host "   1) Hardhat Local (31337)" -ForegroundColor Gray
Write-Host "   2) BSC Testnet (97)" -ForegroundColor Yellow
Write-Host "   3) BSC Mainnet (56)" -ForegroundColor Yellow
Write-Host "   4) Sepolia Testnet (11155111)" -ForegroundColor Gray
Write-Host "   5) Ethereum Mainnet (1)" -ForegroundColor Gray
$opcao = Read-Host "Opção"

switch ($opcao) {
    "1" { $chainId = "31337" }
    "2" { $chainId = "97" }
    "3" { $chainId = "56" }
    "4" { $chainId = "11155111" }
    "5" { $chainId = "1" }
    default { 
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit
    }
}

# Cria o arquivo .env.local
$conteudo = @"
# Endereço do contrato CassoneCoin deployado
NEXT_PUBLIC_CONTRACT_ADDRESS=$contratoEndereco

# ID da rede
NEXT_PUBLIC_CHAIN_ID=$chainId
"@

$conteudo | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host ""
Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Configuração:" -ForegroundColor Cyan
Write-Host "   Contrato: $contratoEndereco" -ForegroundColor White
Write-Host "   Chain ID: $chainId" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Execute: npm run dev" -ForegroundColor White
Write-Host "   2. Acesse: http://localhost:3000" -ForegroundColor White
Write-Host "   3. Conecte sua carteira MetaMask" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Pronto para usar!" -ForegroundColor Green
