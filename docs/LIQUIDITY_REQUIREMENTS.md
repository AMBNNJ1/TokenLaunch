# Cross-Chain Liquidity Requirements Research

## Overview
This document outlines the minimum liquidity requirements for token launches across different blockchains based on research conducted in December 2024.

## Chain-Specific Requirements

### 🟣 Solana
**Primary DEX**: Raydium
**Program**: Standard AMM (CP-Swap) - `CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C`

- **Minimum Liquidity**: ~0.2 SOL
- **Recommended**: 0.5-1.0 SOL for better trading experience
- **Pool Creation Cost**: ~0.2 SOL (Standard AMM)
- **Legacy AMM v4**: ~0.7 SOL (includes OpenBook market creation)
- **Token Requirements**: Freeze authority must be disabled
- **Supported Standards**: SPL tokens, Token-2022 (limited extensions)

**Key Features**:
- No OpenBook market ID required (Standard AMM)
- Supports Token-2022 with Transfer Fees, Metadata Pointer, and MetaData extensions
- Permissionless pool creation
- Automatic LP token burning mechanism

### 🟡 BNB Chain (BSC)
**Primary DEX**: PancakeSwap
**Standard**: BEP-20 tokens

- **Minimum Liquidity**: ~0.05 BNB
- **Recommended**: 0.1-0.2 BNB for better visibility
- **Pool Creation Cost**: ~0.01 BNB + gas fees
- **Gas Optimization**: Up to 99% savings on pool creation fees (PancakeSwap Infinity)
- **Token Requirements**: Standard BEP-20 compliance

**Key Features**:
- No enforced minimum liquidity requirements
- Multiple pool types available (V2, V3, Infinity)
- Permissionless listing
- Native ETH/BNB swap optimization

### 🔺 Avalanche
**Primary DEX**: Trader Joe
**Standard**: ERC-20 tokens on C-Chain

- **Minimum Liquidity**: ~0.5 AVAX
- **Recommended**: 1-2 AVAX for optimal trading
- **Pool Creation Cost**: Standard transaction fees (~0.01-0.02 AVAX)
- **Technology**: Liquidity Book (novel AMM design)
- **Token Requirements**: Standard ERC-20 compliance

**Key Features**:
- Liquidity Book with "bins" for efficiency
- High volatility fee mechanism
- Variable fees based on asset volatility
- Fast, low-cost transactions
- BOOST campaign incentives available

### ⚫ Polkadot Ecosystem
**Primary DEXs**: HydraDX, Basilisk
**Standard**: Substrate-based tokens

- **Minimum Liquidity**: ~2 DOT
- **Recommended**: 5-10 DOT for cross-chain functionality
- **Pool Creation Cost**: Variable based on parachain
- **Cross-Chain**: Native cross-parachain liquidity
- **Token Requirements**: Parachain token standards

**Key Features**:
- Cross-parachain liquidity sharing
- HydraDX-Basilisk synergy
- Frictionless asset bridging
- Native DOT integration
- Kusama-Polkadot bridge support

## Cost Comparison (USD Equivalent)

Based on approximate token prices as of December 2024:

| Chain | Min Liquidity | USD Equivalent | Pool Creation | Total Cost |
|-------|---------------|----------------|---------------|------------|
| Solana | 0.2 SOL | ~$36 | 0.2 SOL | ~$72 |
| BNB Chain | 0.05 BNB | ~$30 | 0.01 BNB | ~$36 |
| Avalanche | 0.5 AVAX | ~$20 | 0.02 AVAX | ~$21 |
| Polkadot | 2 DOT | ~$14 | Variable | ~$20 |

## Recommended Distribution Strategy

### Conservative Approach (Minimum Viable)
- **Total Liquidity**: 1.0 SOL equivalent (~$180)
- **Solana**: 40% (0.4 SOL)
- **BNB Chain**: 30% (0.15 BNB)
- **Avalanche**: 20% (1.0 AVAX)
- **Polkadot**: 10% (2.5 DOT)

### Recommended Approach (Better Trading)
- **Total Liquidity**: 2.5 SOL equivalent (~$450)
- **Solana**: 40% (1.0 SOL)
- **BNB Chain**: 30% (0.4 BNB)
- **Avalanche**: 20% (2.5 AVAX)
- **Polkadot**: 10% (6.0 DOT)

### Aggressive Approach (Maximum Visibility)
- **Total Liquidity**: 5.0 SOL equivalent (~$900)
- **Solana**: 40% (2.0 SOL)
- **BNB Chain**: 30% (0.8 BNB)
- **Avalanche**: 20% (5.0 AVAX)
- **Polkadot**: 10% (12.0 DOT)

## Technical Considerations

### Solana Specific
- Use Standard AMM (CP-Swap) for cost efficiency
- Ensure freeze authority is disabled before pool creation
- Consider Token-2022 for advanced features
- LP tokens are automatically burned for permanent liquidity

### BNB Chain Specific
- PancakeSwap V3 offers better capital efficiency
- Consider PancakeSwap Infinity for gas optimization
- No minimum liquidity enforcement allows flexible starts
- Multiple trading pairs possible (BNB, BUSD, USDT)

### Avalanche Specific
- Trader Joe's Liquidity Book provides better price discovery
- Variable fees adjust to market volatility
- BOOST campaign may provide additional incentives
- Consider Joe V2 for concentrated liquidity

### Polkadot Specific
- HydraDX provides cross-parachain liquidity
- Basilisk offers Kusama connectivity
- Consider parachain-specific requirements
- Cross-chain functionality requires higher liquidity

## Implementation Notes

1. **Validation**: Always validate minimum amounts before pool creation
2. **Slippage**: Account for price impact during large liquidity additions
3. **Timing**: Consider market conditions for optimal launch timing
4. **Monitoring**: Track pool health and trading activity post-launch
5. **Backup Plans**: Prepare for potential rollback scenarios

## Sources
- Raydium Documentation (November 2024)
- PancakeSwap Documentation
- Trader Joe Documentation
- HydraDX/Basilisk Documentation
- Community feedback and real-world testing

## Last Updated
December 2024

---

**Note**: Cryptocurrency markets are highly volatile. These requirements and recommendations should be validated against current market conditions before implementation.
