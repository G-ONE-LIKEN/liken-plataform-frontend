import { createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/B9CrfLKnJ2V4XnKrinSs2'),
});

const ERC20_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function allowance(address, address) view returns (uint256)'
]);

const MARKETPLACE = '0xEb6DF7ae8c2b2ACE74aB06Dca813DaB3BfFE0b0A';
const LKN = '0x864edD22929051D0E6aE285a640074626E1b7c62';
const USDC = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

const SELLER = '0x07307Ee2D30BCC52D000BE5fB44e5d6033bf7350';
const BUYER = '0xbC1a947341A9676fE36A1ae0D9AbD21A36cc0226';

async function main() {
  const sellerLknBalance = await client.readContract({ address: LKN, abi: ERC20_ABI, functionName: 'balanceOf', args: [SELLER] });
  const sellerLknAllowance = await client.readContract({ address: LKN, abi: ERC20_ABI, functionName: 'allowance', args: [SELLER, MARKETPLACE] });
  
  const buyerUsdcBalance = await client.readContract({ address: USDC, abi: ERC20_ABI, functionName: 'balanceOf', args: [BUYER] });
  const buyerUsdcAllowance = await client.readContract({ address: USDC, abi: ERC20_ABI, functionName: 'allowance', args: [BUYER, MARKETPLACE] });

  console.log(`Seller LKN Balance: ${sellerLknBalance.toString()}`);
  console.log(`Seller LKN Allowance: ${sellerLknAllowance.toString()}`);
  console.log(`Buyer USDC Balance: ${buyerUsdcBalance.toString()}`);
  console.log(`Buyer USDC Allowance: ${buyerUsdcAllowance.toString()}`);
}

main().catch(console.error);
