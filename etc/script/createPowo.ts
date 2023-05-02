import { create } from '../../src/index';
import { Wallet } from 'ethers';

/**
 * Usage: 
  yarn script etc/script/createPowo.ts
 */
(async () => {
  const wallet = Wallet.createRandom();

  const signFn = (_domain, _types, _message) => wallet._signTypedData(_domain, _types, _message);

  const proof = await create(signFn, { message: 'test' });
  console.log({ address: wallet.address, proof });
})();
