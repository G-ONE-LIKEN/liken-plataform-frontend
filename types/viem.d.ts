declare module "viem" {
  export function formatUnits(value: bigint, decimals: number): string;
  export function parseEther(value: string): bigint;
  export function parseUnits(value: string, decimals: number): bigint;
  export function keccak256(value: string): `0x${string}`;
  export function toHex(value: string): `0x${string}`;
}
