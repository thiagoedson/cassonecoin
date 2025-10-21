/**
 * Script para mintar (criar) novos CassoneCoin
 * Uso: npx hardhat run scripts/2-mint.js --network localhost
 *
 * ATENÇÃO: Apenas o owner pode mintar!
 */

const { ethers } = require("hardhat");

async function main() {
  // ⚙️ CONFIGURAÇÕES - EDITE AQUI!
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "COLE_O_ENDEREÇO_AQUI";
  const RECIPIENT_ADDRESS = process.env.RECIPIENT || "COLE_O_ENDEREÇO_DESTINO";
  const AMOUNT = process.env.AMOUNT || "1000"; // Quantidade em CASS (não wei)

  // Validações
  if (CONTRACT_ADDRESS === "COLE_O_ENDEREÇO_AQUI") {
    console.log("❌ Erro: Configure o endereço do contrato!");
    return;
  }

  if (RECIPIENT_ADDRESS === "COLE_O_ENDEREÇO_DESTINO") {
    console.log("❌ Erro: Configure o endereço destinatário!");
    return;
  }

  console.log("⚡ Iniciando mintagem de CassoneCoin...\n");

  // Conectar ao contrato
  const cassone = await ethers.getContractAt("CassoneCoin", CONTRACT_ADDRESS);
  const [signer] = await ethers.getSigners();

  // Verificar se é owner
  const owner = await cassone.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    console.log("❌ Erro: Você não é o owner do contrato!");
    console.log("   Owner:", owner);
    console.log("   Você:", signer.address);
    return;
  }

  // Informações antes
  console.log("📊 ANTES DA MINTAGEM");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const supplyBefore = await cassone.totalSupply();
  const balanceBefore = await cassone.balanceOf(RECIPIENT_ADDRESS);
  const cap = await cassone.cap();

  console.log("Supply Total:", ethers.formatEther(supplyBefore), "CASS");
  console.log("Saldo Destinatário:", ethers.formatEther(balanceBefore), "CASS");
  console.log("Cap Máximo:", ethers.formatEther(cap), "CASS");
  console.log("Disponível:", ethers.formatEther(cap - supplyBefore), "CASS");

  // Converter amount para wei
  const amountWei = ethers.parseEther(AMOUNT);

  // Verificar se não vai exceder o cap
  if (supplyBefore + amountWei > cap) {
    console.log("\n❌ Erro: Mintagem excederia o cap máximo!");
    console.log("   Tentando mintar:", AMOUNT, "CASS");
    console.log("   Disponível:", ethers.formatEther(cap - supplyBefore), "CASS");
    return;
  }

  console.log("\n⚙️  MINTANDO...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Quantidade:", AMOUNT, "CASS");
  console.log("Destinatário:", RECIPIENT_ADDRESS);

  // Mintar
  const tx = await cassone.mint(RECIPIENT_ADDRESS, amountWei);
  console.log("\n⏳ Aguardando confirmação...");
  console.log("   TX Hash:", tx.hash);

  await tx.wait();

  // Informações depois
  console.log("\n📊 DEPOIS DA MINTAGEM");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const supplyAfter = await cassone.totalSupply();
  const balanceAfter = await cassone.balanceOf(RECIPIENT_ADDRESS);

  console.log("Supply Total:", ethers.formatEther(supplyAfter), "CASS");
  console.log("Saldo Destinatário:", ethers.formatEther(balanceAfter), "CASS");
  console.log("Diferença Supply:", "+" + ethers.formatEther(supplyAfter - supplyBefore), "CASS");
  console.log("Diferença Saldo:", "+" + ethers.formatEther(balanceAfter - balanceBefore), "CASS");

  console.log("\n✅ Mintagem concluída com sucesso!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  });
