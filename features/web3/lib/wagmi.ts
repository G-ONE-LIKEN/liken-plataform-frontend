import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, type Chain } from "wagmi/chains";
import { env } from "@/shared/config/env";

// wagmi/chains exporta hardhat en runtime pero no en sus tipos — lo definimos a
// mano (chain local de Hardhat, id 31337) para que compile sin romper el build.
const hardhat: Chain = {
  id: 31337,
  name: "Hardhat",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["http://127.0.0.1:8545"] } },
};

const activeChain = env.chainId === 31337 ? hardhat : sepolia;

export const wagmiConfig = getDefaultConfig({
  appName: "LIKEN",
  projectId: env.walletConnectProjectId,
  chains: [activeChain],
  ssr: true,
});

