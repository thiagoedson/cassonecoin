/**
 * Script para transferir CassoneCoin
 * Uso: npx hardhat run scripts/3-transfer.js --network localhost
 */

const { ethers } = require("hardhat");

async function main() {
  // ⚙️ CONFIGURAÇÕES - EDITE AQUI!
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "COLE_O_ENDEREÇO_AQUI";
  const TO_ADDRESS = process.env.TO || "COLE_O_ENDEREÇO_DESTINO";
  const AMOUNT = process.env.AMOUNT || "100"; // Quantidade em CASS

  if (CONTRACT_ADDRESS === "COLE_O_ENDEREÇO_AQUI" || TO_ADDRESS === "COLE_O_ENDEREÇO_DESTINO") {
    console.log("❌ Erro: Configure os endereços!");
    console.log("\nExemplo de uso:");
    console.log("CONTRACT_ADDRESS=0x... TO=0x... AMOUNT=100 npx hardhat run scripts/3-transfer.js --network localhost");
    return;
  }

  console.log("💸 Iniciando transferência de CassoneCoin...\n");

  const cassone = await ethers.getContractAt("CassoneCoin", CONTRACT_ADDRESS);
  const [signer] = await ethers.getSigners();

  // Informações antes
  console.log("📊 ANTES");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const balanceFrom = await cassone.balanceOf(signer.address);
  const balanceTo = await cassone.balanceOf(TO_ADDRESS);

  console.log("De:", signer.address);
  console.log("Saldo:", ethers.formatEther(balanceFrom), "CASS");
  console.log("\nPara:", TO_ADDRESS);
  console.log("Saldo:", ethers.formatEther(balanceTo), "CASS");

  const amountWei = ethers.parseEther(AMOUNT);

  // Verificar saldo suficiente
  if (balanceFrom < amountWei) {
    console.log("\n❌ Erro: Saldo insuficiente!");
    console.log("   Você tem:", ethers.formatEther(balanceFrom), "CASS");
    console.log("   Tentando enviar:", AMOUNT, "CASS");
    return;
  }

  // Transferir
  console.log("\n⚙️  TRANSFERINDO...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Quantidade:", AMOUNT, "CASS");

  const tx = await cassone.transfer(TO_ADDRESS, amountWei);
  console.log("\n⏳ Aguardando confirmação...");
  console.log("   TX Hash:", tx.hash);

  await tx.wait();

  // Informações depois
  console.log("\n📊 DEPOIS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const balanceFromAfter = await cassone.balanceOf(signer.address);
  const balanceToAfter = await cassone.balanceOf(TO_ADDRESS);

  console.log("De:", signer.address);
  console.log("Saldo:", ethers.formatEther(balanceFromAfter), "CASS");
  console.log("Diferença:", "-" + ethers.formatEther(balanceFrom - balanceFromAfter), "CASS");

  console.log("\nPara:", TO_ADDRESS);
  console.log("Saldo:", ethers.formatEther(balanceToAfter), "CASS");
  console.log("Diferença:", "+" + ethers.formatEther(balanceToAfter - balanceTo), "CASS");

  console.log("\n✅ Transferência concluída!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  });
