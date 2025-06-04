# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with turbopack
npm run dev

# Build production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Run tests silently (recommended)
npm test --silent
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `NEXT_PUBLIC_OPENAI_API_KEY` - OpenAI API key for image generation

## Architecture Overview

**PumpFun Token Discovery & Raydium Launcher** - A Next.js app that displays newly launched PumpFun tokens and allows users to launch similar tokens on Solana's Raydium DEX.

### Core Flow
1. **Discovery**: Homepage displays feed of newly launched PumpFun tokens
2. **Selection**: Users explore token details and metrics
3. **Launch**: Multi-step wizard guides new token creation inspired by successful launches
4. **Trading**: Created tokens are immediately tradeable on Raydium

### Key Architecture Components

**Frontend (React + Next.js)**
- `/src/app/` - Next.js 15 app router pages
- `/src/components/` - Reusable UI components
- `/src/components/steps/` - Token launch wizard steps
- Solana wallet integration via `@solana/wallet-adapter-react`

**State Management**
- Custom hooks in `/src/hooks/` for complex state (launch process, token fetching)
- React state for UI components

**Blockchain Integration**
- `/src/lib/solana.ts` - Core Solana connection utilities
- `/src/lib/token.ts` - SPL token creation logic  
- `/src/lib/raydium.ts` - Raydium AMM integration
- Built on Solana with SPL tokens and Metaplex metadata

**PumpFun Integration**
- Fetch and display newly launched PumpFun tokens
- Analyze successful token patterns and metrics
- Provide inspiration for new token launches

**Token Launch Wizard Steps**
1. `TokenInfoStep` - Name, symbol, description, image
2. `LiquidityStep` - Initial SOL amount and LP configuration  
3. `ReviewStep` - Final confirmation
4. `ProgressStep` - Real-time transaction progress
5. `SuccessStep` - Launch results with trading links

### Testing

Uses Jest with jsdom environment. Test files use `.test.ts/.test.tsx` extensions.

### Important Notes

- Application focuses on PumpFun token discovery and analysis
- All blockchain operations include retry logic and proper error handling
- Path aliases: `@/*` maps to `./src/*`
- TypeScript strict mode enabled
- Tailwind CSS for styling with custom wallet styles