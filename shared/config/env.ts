// Variables de entorno expuestas al cliente.
// Para producción: ver .env.local.example.
//
// Notas:
// - El supply de LKN es global (un único `LinkenToken` para toda la plataforma).
// - Cada proyecto tiene su propio `OfferingContract` deployado — la address NO
//   está acá, viene del backend en `ProjectSummary.offeringContractAddress`.
// - Se quitaron `paymentGatewayAddress` y `onrampAddress`: esos contratos no
//   existen en la arquitectura final (ver ADR-0013 y la nueva doc de blockchain).
function normalizeApiUrl(value: string | undefined) {
  const fallback = "http://localhost:8090";
  const raw = (value ?? fallback).trim();
  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/api$/i, "");
}

export const env = {
  apiUrl: normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL),
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "demo-wallet-connect-project-id",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111"),

  /** ERC-20 global LKN (supply fijo emitido en el TGE). */
  lknAddress:
    process.env.NEXT_PUBLIC_LKN_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  /** Registry de proyectos on-chain (etapas FUNDING/ACTIVE/PAUSED + precios). */
  registryAddress:
    process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  /** DividendDistributor global (recibe USDC, holders retiran en pull). */
  distributorAddress:
    process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  /** USDC ERC-20 oficial en la red configurada (en Sepolia: Circle test USDC). */
  usdcAddress:
    process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0x0000000000000000000000000000000000000000",

  /** Prefijo del block explorer para deeplinks (sepolia.etherscan.io o etherscan.io). */
  blockExplorerUrl:
    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ?? "https://sepolia.etherscan.io",

  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
};
