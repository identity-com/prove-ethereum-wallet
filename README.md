# Prove-Ethereum-Wallet

This library proves ownership of an Ethereum wallet to off-chain verifiers. To create proof of ownership, a signing function must be provided that allows the user to sign some typed-data with their private key, thus proving they own the wallet. The verifier will check that the signature of the signer matches the wallet address to check, and that the contents of the signed typed-message are valid. The proof consists of a string of a base64 version of the message concatenated with a '.' and the base64 version of the signature. 

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
const { create } = require('@identity.com/prove-ethereum-wallet');
const ownerWallet = Wallet.createRandom();

const proof = await create((domain, types, message) => wallet._signTypedData(domain, types, message), { message: '<verifierUrl>' });
```

Verifier side:
```js
const { verify } = require('@identity.com/prove-ethereum-wallet');
const success = await verify(expectedOwnerAddress, proof, { message: '<verifierUrl>' });
```

## Details

The prove() function generates some typed-data, including an expiry timestamp and message and
signs it with the wallet private key. For the transaction to be verified
by the verify() function, it must:

- have an expiry that is before UTC now()
- be signed by the expected wallet address
- contain a matching message


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
    { name: "message", type: "string" },
  ],
};
```

### `message` 

Optional
Default: empty

The message passed to check against the proof. This would normally be a nonce, or single use message to prevent the POWO from being re-used in a replay-attack.
