export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8090",
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "demo-wallet-connect-project-id",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "11155111"),
  paymentGatewayAddress:
    process.env.NEXT_PUBLIC_PAYGW_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  usdcAddress:
    process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  onrampAddress:
    process.env.NEXT_PUBLIC_ONRAMP_ADDRESS ?? "0x0000000000000000000000000000000000000000",
  lknAddress:
    process.env.NEXT_PUBLIC_LKN_ADDRESS ?? "0x0000000000000000000000000000000000000000",
};
