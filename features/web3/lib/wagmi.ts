import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";
import { env } from "@/shared/config/env";

const activeChain = env.chainId === 31337 ? hardhat : sepolia;

export const wagmiConfig = getDefaultConfig({
  appName: "LIKEN",
  projectId: env.walletConnectProjectId,
  chains: [activeChain],
  ssr: true,
});

