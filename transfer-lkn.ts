import { createWalletClient, http, parseAbi, parseEther, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const rpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/B9CrfLKnJ2V4XnKrinSs2';
const adminPrivateKey = '0xc2ddc43323e0aa0f2127d1e81e7739d663db5df50839bb17ee9fc60aa7c52cd2';
const LKN = '0x864edD22929051D0E6aE285a640074626E1b7c62';
const SELLER = '0x07307Ee2D30BCC52D000BE5fB44e5d6033bf7350'; // nicoromero.16

const account = privateKeyToAccount(adminPrivateKey);

const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain: sepolia, transport: http(rpcUrl) });

const ERC20_ABI = parseAbi(['function transfer(address to, uint256 amount) returns (bool)']);

async function main() {
  console.log('Sending 100 LKN to seller...');
  
  const hash = await walletClient.writeContract({
    address: LKN,
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [SELLER, parseEther('100')],
  });
  
  console.log(`Transaction sent: ${hash}`);
  
  console.log('Waiting for receipt...');
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  if (receipt.status === 'success') {
    console.log('Transfer successful!');
  } else {
    console.error('Transfer failed!');
  }
}

main().catch(console.error);
