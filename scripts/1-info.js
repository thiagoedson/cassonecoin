/**
 * Script para ver informações do CassoneCoin
 * Uso: npx hardhat run scripts/1-info.js --network localhost
 */

const { ethers } = require("hardhat");

async function main() {
  // CONFIGURE AQUI: Cole o endereço do contrato deployado
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "COLE_O_ENDEREÇO_AQUI";

  if (CONTRACT_ADDRESS === "COLE_O_ENDEREÇO_AQUI") {
    console.log("❌ Erro: Configure o endereço do contrato!");
    console.log("   Edite o arquivo ou use: CONTRACT_ADDRESS=0x... npx hardhat run scripts/1-info.js");
    return;
  }

  console.log("🔍 Buscando informações do CassoneCoin...\n");

  // Conectar ao contrato
  const cassone = await ethers.getContractAt("CassoneCoin", CONTRACT_ADDRESS);
  const [signer] = await ethers.getSigners();

  // Informações básicas
  console.log("📊 INFORMAÇÕES BÁSICAS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Nome:", await cassone.name());
  console.log("Símbolo:", await cassone.symbol());
  console.log("Decimais:", await cassone.decimals());
  console.log("Contrato:", CONTRACT_ADDRESS);

  // Supply
  console.log("\n💰 SUPPLY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const totalSupply = await cassone.totalSupply();
  const cap = await cassone.cap();
  const maxSupply = await cassone.getMaxSupply();

  console.log("Supply Total:", ethers.formatEther(totalSupply), "CASS");
  console.log("Cap Máximo:", ethers.formatEther(cap), "CASS");
  console.log("Supply Máximo:", ethers.formatEther(maxSupply), "CASS");
  console.log("Disponível para Mint:", ethers.formatEther(cap - totalSupply), "CASS");

  // Percentual usado
  const percentUsed = (Number(totalSupply) / Number(cap) * 100).toFixed(2);
  console.log("Percentual Usado:", percentUsed + "%");

  // Ownership
  console.log("\n👑 CONTROLE");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const owner = await cassone.owner();
  console.log("Owner:", owner);
  console.log("Você é o owner?", owner.toLowerCase() === signer.address.toLowerCase() ? "✅ SIM" : "❌ NÃO");

  // Status
  console.log("\n⚙️  STATUS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const paused = await cassone.paused();
  console.log("Pausado?", paused ? "🔴 SIM" : "🟢 NÃO");

  // Seu saldo
  console.log("\n💵 SEU SALDO");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const balance = await cassone.balanceOf(signer.address);
  console.log("Endereço:", signer.address);
  console.log("Saldo:", ethers.formatEther(balance), "CASS");

  // Percentual do supply que você tem
  if (Number(totalSupply) > 0) {
    const yourPercent = (Number(balance) / Number(totalSupply) * 100).toFixed(2);
    console.log("% do Supply:", yourPercent + "%");
  }

  console.log("\n✅ Concluído!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
