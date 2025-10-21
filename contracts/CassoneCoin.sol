// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CassoneCoin
 * @dev Implementação do token CASS com funcionalidades avançadas:
 * - Mintagem controlada pelo owner
 * - Cap máximo de supply (limite de 10 milhões de tokens)
 * - Queima de tokens (burn)
 * - Pausar/Despausar transferências em emergências
 * - Baseado em OpenZeppelin para máxima segurança
 */
contract CassoneCoin is ERC20, ERC20Burnable, ERC20Pausable, ERC20Capped, Ownable {

    // Supply máximo: 10 milhões de CASS tokens
    uint256 private constant MAX_SUPPLY = 10_000_000 * 10**18;

    /**
     * @dev Constructor que cria o token e faz o mint inicial
     * @param initialSupply Quantidade inicial de tokens (em unidades, não wei)
     */
    constructor(uint256 initialSupply)
        ERC20("Cassone Coin", "CASS")
        ERC20Capped(MAX_SUPPLY)
        Ownable(msg.sender)
    {
        require(initialSupply <= 10_000_000, "Initial supply exceeds maximum");
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Cria novos tokens. Apenas o owner pode executar.
     * Respeitando o cap máximo definido.
     * @param to Endereço que receberá os tokens
     * @param amount Quantidade de tokens (em wei)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Pausa todas as transferências de tokens.
     * Útil em caso de emergência ou ataque detectado.
     * Apenas o owner pode executar.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Despausa as transferências de tokens.
     * Apenas o owner pode executar.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Retorna o cap máximo de supply
     */
    function getMaxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /**
     * @dev Hook chamado antes de qualquer transferência de tokens.
     * Implementa as verificações de pause e cap.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Capped)
    {
        super._update(from, to, value);
    }
}
