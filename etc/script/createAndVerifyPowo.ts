import { create, verify } from '../../src/index';
import { Wallet } from 'ethers';

/**
 * Usage: 
  yarn script etc/script/createAndVerifyPowo.ts
 */
(async () => {
  const wallet = Wallet.createRandom();

  const signFn = (_domain, _types, _message) => wallet._signTypedData(_domain, _types, _message);

  const proof = await create(signFn, { verifierAddress: 'test' });
  console.log(JSON.stringify({ address: wallet.address, proof }, null, 2));

  const result = await verify(wallet.address, proof, {
    verifierAddress: 'test',
  });
  console.log(`Verify result: ${result}`);
})();
