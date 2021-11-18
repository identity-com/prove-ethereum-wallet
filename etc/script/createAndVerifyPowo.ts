import { createPowo, verifyPowo } from '../../src/index';
import { Wallet } from 'ethers';

/**
 * Usage: 
  yarn script etc/script/createAndVerifyPowo.ts
 */
(async () => {
  const wallet = Wallet.createRandom();

  const signFn = (_domain, _types, _message) => wallet._signTypedData(_domain, _types, _message);

  const proof = await createPowo(signFn, { verifierAddress: 'test' });
  console.log({ address: wallet.address, proof });

  const result = await verifyPowo(wallet.address, proof, {
    verifierAddress: 'test',
  });
  console.log(`Verify result: ${result}`);
})();
