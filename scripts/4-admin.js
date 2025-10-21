/**
 * Script de administração: Burn e Pause/Unpause
 * Uso: npx hardhat run scripts/4-admin.js --network localhost
 */

const { ethers } = require("hardhat");
const readline = require("readline");

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || await question("Endereço do contrato: ");

  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "") {
    console.log("❌ Endereço inválido!");
    rl.close();
    return;
  }

  console.log("\n🛠️  Painel de Administração do CassoneCoin\n");

  const cassone = await ethers.getContractAt("CassoneCoin", CONTRACT_ADDRESS);
  const [signer] = await ethers.getSigners();

  // Verificar owner
  const owner = await cassone.owner();
  const isOwner = owner.toLowerCase() === signer.address.toLowerCase();

  // Status
  console.log("📊 STATUS ATUAL");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contrato:", CONTRACT_ADDRESS);
  console.log("Owner:", owner);
  console.log("Você:", signer.address);
  console.log("É owner?", isOwner ? "✅ SIM" : "❌ NÃO");

  const totalSupply = await cassone.totalSupply();
  const balance = await cassone.balanceOf(signer.address);
  const paused = await cassone.paused();
  const cap = await cassone.cap();

  console.log("\nSupply Total:", ethers.formatEther(totalSupply), "CASS");
  console.log("Seu Saldo:", ethers.formatEther(balance), "CASS");
  console.log("Pausado?", paused ? "🔴 SIM" : "🟢 NÃO");
  console.log("Cap Máximo:", ethers.formatEther(cap), "CASS");

  // Menu
  console.log("\n⚙️  AÇÕES DISPONÍVEIS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. 🔥 Queimar (Burn) tokens");
  console.log("2. ⏸️  Pausar contrato" + (paused ? " (já pausado)" : ""));
  console.log("3. ▶️  Despausar contrato" + (!paused ? " (já ativo)" : ""));
  console.log("4. 👑 Transferir ownership" + (!isOwner ? " (precisa ser owner)" : ""));
  console.log("5. ❌ Sair");

  const choice = await question("\nEscolha uma opção (1-5): ");

  switch (choice) {
    case "1": // Burn
      const burnAmount = await question("Quantidade para queimar (CASS): ");
      if (!burnAmount || isNaN(burnAmount)) {
        console.log("❌ Quantidade inválida!");
        break;
      }

      const burnWei = ethers.parseEther(burnAmount);
      if (burnWei > balance) {
        console.log("❌ Saldo insuficiente!");
        console.log("   Você tem:", ethers.formatEther(balance), "CASS");
        break;
      }

      console.log("\n🔥 Queimando", burnAmount, "CASS...");
      const burnTx = await cassone.burn(burnWei);
      await burnTx.wait();

      const newSupply = await cassone.totalSupply();
      console.log("✅ Queima concluída!");
      console.log("   Supply antes:", ethers.formatEther(totalSupply), "CASS");
      console.log("   Supply agora:", ethers.formatEther(newSupply), "CASS");
      console.log("   Redução:", "-" + ethers.formatEther(totalSupply - newSupply), "CASS");
      break;

    case "2": // Pause
      if (!isOwner) {
        console.log("❌ Apenas o owner pode pausar!");
        break;
      }
      if (paused) {
        console.log("⚠️  Contrato já está pausado!");
        break;
      }

      const confirm = await question("⚠️  Tem certeza que quer pausar? (sim/não): ");
      if (confirm.toLowerCase() !== "sim") {
        console.log("❌ Cancelado");
        break;
      }

      console.log("\n⏸️  Pausando contrato...");
      const pauseTx = await cassone.pause();
      await pauseTx.wait();
      console.log("✅ Contrato pausado!");
      console.log("   Ninguém pode transferir, mintar ou queimar até despausar");
      break;

    case "3": // Unpause
      if (!isOwner) {
        console.log("❌ Apenas o owner pode despausar!");
        break;
      }
      if (!paused) {
        console.log("⚠️  Contrato já está ativo!");
        break;
      }

      console.log("\n▶️  Despausando contrato...");
      const unpauseTx = await cassone.unpause();
      await unpauseTx.wait();
      console.log("✅ Contrato despausado!");
      console.log("   Operações normais restauradas");
      break;

    case "4": // Transfer Ownership
      if (!isOwner) {
        console.log("❌ Apenas o owner pode transferir ownership!");
        break;
      }

      const newOwner = await question("Novo owner (endereço): ");
      if (!newOwner || !ethers.isAddress(newOwner)) {
        console.log("❌ Endereço inválido!");
        break;
      }

      const confirmOwnership = await question("⚠️  ATENÇÃO: Você perderá o controle! Confirma? (sim/não): ");
      if (confirmOwnership.toLowerCase() !== "sim") {
        console.log("❌ Cancelado");
        break;
      }

      console.log("\n👑 Transferindo ownership...");
      const transferTx = await cassone.transferOwnership(newOwner);
      await transferTx.wait();
      console.log("✅ Ownership transferido!");
      console.log("   Novo owner:", newOwner);
      break;

    case "5":
      console.log("\n👋 Até logo!");
      break;

    default:
      console.log("❌ Opção inválida!");
  }

  rl.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    rl.close();
    process.exit(1);
  });
