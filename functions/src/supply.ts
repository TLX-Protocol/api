import { Contract, Interface, JsonRpcProvider } from "ethers";
import {
  Airdrop,
  AmmDistributor,
  Bonding,
  GenesisLocker,
  MAX_SUPPLY,
  OPTIMISM_RPC,
  Staker,
  TLX,
  Vesting,
} from "./constants";

import bigintToNumber from "./helpers/big-nt-to-number";

const provider = new JsonRpcProvider(OPTIMISM_RPC);
const erc20abi = new Interface(["function balanceOf(address) view returns (uint256)"]);
const tlx = new Contract(TLX, erc20abi, provider);
const lockerabi = new Interface(["function totalStaked() view returns (uint256)"]);
const locker = new Contract(GenesisLocker, lockerabi, provider);

export const getCirculatingSupply = async () => {
  const EXCLUDED_ADDRESSES = [Airdrop, Bonding, GenesisLocker, Vesting, Staker, AmmDistributor];

  const [airdropBalance, bondingBalance, genesisLockerBalance, vestingBalance, stakerBalance] = await Promise.all(
    EXCLUDED_ADDRESSES.map((address) => tlx.balanceOf(address))
  );

  const totalExcluded = airdropBalance + bondingBalance + genesisLockerBalance + vestingBalance + stakerBalance;

  return MAX_SUPPLY - bigintToNumber(totalExcluded);
};

export const getTotalSupply = async () => {
  const EXCLUDED_ADDRESSES = [Airdrop, Bonding, GenesisLocker, Vesting, AmmDistributor];

  const [airdropBalance, bondingBalance, genesisLockerBalance, stakerBalance, totalStaked] = await Promise.all([
    ...EXCLUDED_ADDRESSES.map((address) => tlx.balanceOf(address)),
    locker.totalStaked(),
  ]);

  const totalExcluded = airdropBalance + bondingBalance + genesisLockerBalance + stakerBalance - totalStaked;

  return MAX_SUPPLY - bigintToNumber(BigInt(totalExcluded));
};

export const getMaxSupply = async () => {
  return Promise.resolve(MAX_SUPPLY);
};
