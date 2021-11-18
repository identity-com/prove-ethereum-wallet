import { Wallet } from 'ethers';
import { create, verify } from '../src';

const expired = {
  address: '0xcc222A1eb3d6772A414A24d426907dC4c144eF0F',
  proof:
    'eyJleHBpcmVzIjoiMjAyMS0xMS0xOFQxMzoxNTo0Ni43ODhaIiwidmVyaWZpZXJBZGRyZXNzIjoidGVzdCJ9.MHhhNDA4ZDBlZGRhODY4OTY4ZmE5ODhmNzAzODhhZDg3M2M2MGI1M2I3NjJhZDYxZGJkYzhmMDQwMDc4MDQzZmIwMGFkNTI2Y2VkYTAyMDM5ODdlYjQyMjBiYWRlNGU3NDMxZjkxMjJhYzJhMGI0YzUzM2E1MDVmOTI1OThjYTBmZjFi',
};

describe('prove-solana-wallet', () => {
  afterEach(() => jest.restoreAllMocks());

  let wallet: Wallet;
  let verifierAddress: string;
  beforeEach(() => {
    verifierAddress = 'test';
    wallet = Wallet.createRandom();
  });

  it('creates a wallet ownership proof when a signer function is provided', async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      verifierAddress,
    });
    expect(proof).toMatch(/.*\..*/); // the message is a base64 version of the signature concatenated with the message
  });

  it('verifies wallet ownership with provided signer function', async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      verifierAddress,
    });
    await expect(verify(wallet.address, proof, { verifierAddress })).resolves.not.toThrow();
  });

  it('throws an error if the transaction is signed with a different key', async () => {
    const someOtherKey = Wallet.createRandom();

    const proof = await create((...args) => wallet._signTypedData(...args), {
      verifierAddress,
    });
    await expect(verify(someOtherKey.address, proof, { verifierAddress })).rejects.toThrow();
  });

  it('throws an error if the proof is expired', async () => {
    await expect(verify(expired.address, expired.proof, { verifierAddress: 'test' })).rejects.toThrow('Token Expired');
  });

  it("throws an error if the verifierAddress doesn't match", async () => {
    const proof = await create((...args) => wallet._signTypedData(...args), {
      verifierAddress: 'bad',
    });
    await expect(verify(wallet.address, proof, { verifierAddress: 'test' })).rejects.toThrow('Bad verifier address');
  });
});
