# Prove-Ethereum-Wallet

This library proves ownership of an Ethereum wallet to off-chain verifiers. To create proof of ownership, a signing function must be provided that allows the user to sign some typed-data with their private key, thus proving they own the wallet. The verifier will check that the signature of the signer matches the wallet address to check, and that the contents of the signed typed-message are valid.

## Install

```sh
npm install @identity.com/prove-ethereum-wallet
```

or 

```sh
yarn add @identity.com/prove-ethereum-wallet
```

## Usage

Prove ownership of an Ethereum wallet

Prover side: 
```js
const { createPowo } = require('@identity.com/prove-ethereum-wallet');
const ownerWallet = Wallet.createRandom();

const proof = await createPowo((domain, types, message) => wallet._signTypedData(domain, types, message), { verifierAddress: '<verifierUrl>' });
```

Verifier side:
```js
const { verifyPowo } = require('@identity.com/prove-ethereum-wallet');
const success = await verifyPowo(expectedOwnerAddress, proof, { verifierAddress: '<verifierUrl>' });
```

## Details

The prove() function generates some typed-data, including an expiry timestamp and verifierAddress and
signs it with the wallet private key. For the transaction to be verified
by the verify() function, it must:

- have an expiry that is before UTC now()
- be signed by the expected wallet address
- contain a matching verifierAddress


## Configuration

The prove and verify functions can be configured as follows:

### `domain` Optionally set the domain for the signed data

Optional
Default:
```
export const defaultDomain: TypedDataDomain = {
  name: "Proof Of Ethereum Wallet Ownership",
  version: "1",
};
```

### `types` Optionally set the types to be used in the signed data

Optional
Default:
```
export const defaultTypes: Record<string, Array<TypedDataField>> = {
  PoWo: [
    { name: "expires", type: "string" },
    { name: "verifierAddress", type: "string" },
  ],
};
```

### `verifierAddress` 

Optional
Default: empty

The address of the verifier that should be used to check this proof. This could be a URL, a DID, or any string that the create wants.
