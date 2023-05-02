import { Wallet } from 'ethers';
import { create, verify } from '../src';

const expired = {
  address: '0x802757E805F590f37a5A3f625EaC1061f475D873',
  proof:
    'eyJleHBpcmVzIjoiMjAyMy0wNS0wMlQxMDozODozNy4xODNaIiwibWVzc2FnZSI6InRlc3QifQ==.MHg2YjQ2N2YxMDE4NTc2YjE3NDliNDk5ODNhMWUzMTgzMDE4YTc4ODIxMTgzYjcxZTYzNTU0ZDViNTdiNWUyY2IzMzE3N2IxYWU3YzgxYTg2Y2U2MTU1NTIyMzhiN2QxYjc3NjQzMjZiMjIwNzg0YmEyOTViOTYzZDM2MjI1ZDIxZTFj',
};

describe('prove-solana-wallet', () => {
  afterEach(() => jest.restoreAllMocks());

  let wallet: Wallet;
  let message: string;
  beforeEach(() => {
    message = 'test';
    wallet = Wallet.createRandom();
  });

  it('creates a wallet ownership proof when a signer function is provided', async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      message,
    });
    expect(proof).toMatch(/.*\..*/); // the message is a base64 version of the signature concatenated with the message
  });

  it('verifies wallet ownership with provided signer function', async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      message,
    });
    await expect(verify(wallet.address, proof, { message })).resolves.not.toThrow();
  });

  it('throws an error if the transaction is signed with a different key', async () => {
    const someOtherKey = Wallet.createRandom();

    const proof = await create((...args) => wallet._signTypedData(...args), {
      message,
    });
    await expect(verify(someOtherKey.address, proof, { message })).rejects.toThrow();
  });

  it('throws an error if the proof is expired', async () => {
    await expect(verify(expired.address, expired.proof, { message: 'test' })).rejects.toThrow('Token Expired');
  });

  it("throws an error if the message doesn't match", async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      message: 'bad',
    });
    await expect(verify(wallet.address, proof, { message: 'test' })).rejects.toThrow('Bad message');
  });
});
