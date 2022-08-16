import { Network } from './networks'
import { BigNumber } from '@ethersproject/bignumber'
import { getToken, Token } from './token'
import { BentoBoxV1 } from './BentoBoxV1'
import { KashiPair } from './KashiPair'
import { Transaction, Log, getLogs, getAddrTransactions } from './scanAPI'
import { getAllKashiPairsBentoV1 } from './getKashiPairsInfo'


export async function liquidate(network: Network) {
  const pairs = await getAllKashiPairsBentoV1(network);
  pairs.forEach(async (pair) => {
    (pair.inSolventBorrowers || []).forEach(async (borrower) => {
      const kashiPair = new KashiPair(network, pair.address)
      const percent = Math.min(Math.ceil(borrower.coverage - 100), 50)
      console.log(`Liquidating ${percent}%, ${borrower.address} of pair: ${pair.collateral.symbol()}->${pair.asset.symbol()}`)
      await kashiPair.liquidate(borrower.address, borrower.borrowPart.mul(percent).div(100))
    });
  });
}