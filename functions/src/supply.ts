import { Contract, Interface, JsonRpcProvider } from "ethers";
import {
  Airdrop,
  AmmDistributor,
  Bonding,
  GenesisLocker,
  MAX_SUPPLY,
  OPTIMISM_RPC,
  TLX,
  VelodromeVoterAutomation,
  Vesting,
} from "./constants";

import bigintToNumber from "./helpers/bigint-to-number";

const provider = new JsonRpcProvider(OPTIMISM_RPC);
const erc20abi = new Interface(["function balanceOf(address) view returns (uint256)"]);
const tlx = new Contract(TLX, erc20abi, provider);
const lockerAbi = new Interface(["function totalStaked() view returns (uint256)"]);
const locker = new Contract(GenesisLocker, lockerAbi, provider);

export const getCirculatingSupply = async () => {
  const EXCLUDED_ADDRESSES = [Airdrop, Bonding, GenesisLocker, Vesting, AmmDistributor, VelodromeVoterAutomation];

  const [airdropBalance, bondingBalance, genesisLockerBalance, vestingBalance, ammBalance, voterBalance, totalStaked] =
    await Promise.all([...EXCLUDED_ADDRESSES.map((address) => tlx.balanceOf(address)), locker.totalStaked()]);

  const lockedAmount = genesisLockerBalance - totalStaked;

  const totalExcluded = airdropBalance + bondingBalance + lockedAmount + vestingBalance + ammBalance + voterBalance;

  return MAX_SUPPLY - bigintToNumber(totalExcluded);
};

export const getTotalSupply = async () => {
  return Promise.resolve(MAX_SUPPLY);
};

export const getMaxSupply = async () => {
  return Promise.resolve(MAX_SUPPLY);
};
