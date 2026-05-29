import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { env } from "@/shared/config/env";

export const wagmiConfig = getDefaultConfig({
  appName: "LIKEN",
  projectId: env.walletConnectProjectId,
  chains: [sepolia],
  ssr: true,
});
