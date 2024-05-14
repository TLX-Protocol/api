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
  OldBonding,
} from "./constants";

import bigintToNumber from "./helpers/bigint-to-number";

const provider = new JsonRpcProvider(OPTIMISM_RPC);
const erc20abi = new Interface(["function balanceOf(address) view returns (uint256)"]);
const tlx = new Contract(TLX, erc20abi, provider);

export const getCirculatingSupply = async () => {
  const EXCLUDED_ADDRESSES = [Airdrop, Bonding, GenesisLocker, Vesting, Staker, AmmDistributor, OldBonding];

  const [airdropBalance, bondingBalance, genesisLockerBalance, vestingBalance, stakerBalance, ammBalance] =
    await Promise.all(EXCLUDED_ADDRESSES.map((address) => tlx.balanceOf(address)));

  const totalExcluded =
    airdropBalance + bondingBalance + genesisLockerBalance + vestingBalance + stakerBalance + ammBalance;

  return MAX_SUPPLY - bigintToNumber(totalExcluded);
};

export const getTotalSupply = async () => {
  return Promise.resolve(MAX_SUPPLY);
};

export const getMaxSupply = async () => {
  return Promise.resolve(MAX_SUPPLY);
};
