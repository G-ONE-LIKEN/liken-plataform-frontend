declare module "wagmi/chains" {
  export type Chain = {
    id: number;
    name: string;
    nativeCurrency?: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls?: Record<string, { http: string[] }>;
  };

  export const sepolia: Chain;
}
