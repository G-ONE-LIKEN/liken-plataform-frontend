// ABIs (sólo los fragmentos que usa el frontend) de los 4 contratos productivos
// definidos en `tp-group-one-linken/contracts/src/`.
//
// Mantenemos los ABIs mínimos para no inflar el bundle; agregar más entradas a
// demanda. Cada ABI está marcado `as const` para inferencia exacta en wagmi/viem.
//
// Convenciones:
//   - USDC: 6 decimales.
//   - LKN: 18 decimales.
//   - Precios en USDC por LKN: 6 decimales (ej. 10_000_000 = $10).

/** ─── ERC-20 estándar (sirve para LKN, USDC y cualquier ERC-20). */
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

/** ─── ProjectRegistry.sol — sólo views que el front necesita. */
export const PROJECT_REGISTRY_ABI = [
  {
    type: "function",
    name: "currentPrice",
    stateMutability: "view",
    inputs: [{ name: "projectId", type: "uint256" }],
    outputs: [{ type: "uint256" }], // USDC con 6 decimales
  },
  {
    type: "function",
    name: "getProject",
    stateMutability: "view",
    inputs: [{ name: "projectId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "name", type: "string" },
          { name: "description", type: "string" },
          { name: "owner", type: "address" },
          { name: "stage", type: "uint8" }, // 0=FUNDING, 1=ACTIVE, 2=PAUSED
          { name: "earlyBirdPrice", type: "uint256" },
          { name: "standardPrice", type: "uint256" },
          { name: "exists", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "StageChanged",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "newStage", type: "uint8", indexed: false },
    ],
  },
] as const;

/** ─── OfferingContract.sol — el contrato cambia por proyecto, mismo ABI. */
export const OFFERING_CONTRACT_ABI = [
  // Views
  {
    type: "function",
    name: "state",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }], // 0=PENDING, 1=OPEN, 2=FINALIZED, 3=FAILED
  },
  {
    type: "function",
    name: "tokenPrice",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "softCap",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "hardCap",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalRaised",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "lknAvailable",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "contributions",
    stateMutability: "view",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "deadline",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "isActive",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "bool" }],
  },

  // Escritura (las firma el inversor con MetaMask)
  {
    type: "function",
    name: "buy",
    stateMutability: "nonpayable",
    inputs: [{ name: "usdcAmount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "refund",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },

  // Eventos (indexados por el Blockchain Service)
  {
    type: "event",
    name: "TokensPurchased",
    inputs: [
      { name: "buyer", type: "address", indexed: true },
      { name: "usdcAmount", type: "uint256", indexed: false },
      { name: "lknAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RoundFinalized",
    inputs: [
      { name: "totalRaised", type: "uint256", indexed: false },
      { name: "lknSold", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RoundFailed",
    inputs: [
      { name: "totalRaised", type: "uint256", indexed: false },
      { name: "softCap", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Refunded",
    inputs: [
      { name: "investor", type: "address", indexed: true },
      { name: "usdcAmount", type: "uint256", indexed: false },
    ],
  },
] as const;

/** ─── DividendDistributor.sol — patrón pull, sin loops sobre holders. */
export const DIVIDEND_DISTRIBUTOR_ABI = [
  {
    type: "function",
    name: "pendingDividends",
    stateMutability: "view",
    inputs: [{ name: "holder", type: "address" }],
    outputs: [{ type: "uint256" }], // USDC con 6 decimales
  },
  {
    type: "function",
    name: "totalDividendsEarned",
    stateMutability: "view",
    inputs: [{ name: "holder", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "claimDividends",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "depositDividends",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    type: "event",
    name: "DividendsDeposited",
    inputs: [
      { name: "depositor", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DividendsWithdrawn",
    inputs: [
      { name: "holder", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;
