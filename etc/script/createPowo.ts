import { create } from '../../src/index';
import { Wallet } from 'ethers';

/**
 * Usage: 
  yarn script etc/script/createPowo.ts
 */
(async () => {
  const wallet = Wallet.createRandom();

  const proof = await create((...args) => wallet._signTypedData(...args), { verifierAddress: 'test' });
  console.log({ address: wallet.address, proof });
})();
