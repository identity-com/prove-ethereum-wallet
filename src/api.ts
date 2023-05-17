import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Buffer } from 'buffer';
import { verifyTypedData } from 'ethers/lib/utils';
import { CreatePowoOptions, defaultDomain, EthPowoMessage, VerifyPowoOptions } from './types';

const getTypes = (verifierAddress?: string, message?: string) => {
  const useTypes = {
    PoWo: [{ name: 'expires', type: 'string' }],
  };
  if (verifierAddress) {
    useTypes.PoWo.push({ name: 'verifierAddress', type: 'string' });
  }
  if (message) {
    useTypes.PoWo.push({ name: 'message', type: 'string' });
  }
  return useTypes;
};

export const create = async (
  signTypedData: (
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: EthPowoMessage
  ) => Promise<string>,
  { domain = defaultDomain, message, verifierAddress }: CreatePowoOptions
): Promise<string> => {
  const tokenDurationMs = 1000 * 5 * 60; // 5 minutes
  const expires = new Date(Date.now() + tokenDurationMs);
  const powoMessage: EthPowoMessage = {
    expires: expires.toISOString(),
    ...(message ? { message } : {}),
    ...(verifierAddress ? { verifierAddress } : {}),
  };
  const useTypes = getTypes(verifierAddress, message);
  const signature = await signTypedData(domain, useTypes, powoMessage);
  if (!signature) throw new Error('Error creating powo');

  const msgString = JSON.stringify(powoMessage);
  const messageB64 = Buffer.from(msgString).toString('base64');
  const signatureB64 = Buffer.from(signature).toString('base64');
  return `${messageB64}.${signatureB64}`;
};

export const verify = async (
  address: string,
  proof: string,
  { domain = defaultDomain, message, verifierAddress }: VerifyPowoOptions
): Promise<boolean> => {
  console.log('verifyPowo raw', { address, proof });
  const [b64TypedMessage, signature] = proof.split('.');
  const decodedSignature = Buffer.from(signature, 'base64').toString();
  const decodedMessage = JSON.parse(Buffer.from(b64TypedMessage, 'base64').toString('utf-8')) as EthPowoMessage;

  console.log('verifyPowo decoded', { decodedSignature, decodedMessage });
  const useTypes = getTypes(verifierAddress, message);

  const recoveredAddress = verifyTypedData(domain, useTypes, decodedMessage, decodedSignature);
  if (recoveredAddress !== address) {
    throw new Error('Message was signed by unexpected wallet');
  }

  if (new Date(decodedMessage.expires).getTime() < Date.now()) {
    throw new Error('Token Expired');
  }

  if (decodedMessage.message && message && decodedMessage.message !== message) {
    throw new Error('Bad message');
  }

  if (decodedMessage.verifierAddress && verifierAddress && decodedMessage.verifierAddress !== verifierAddress) {
    throw new Error('Bad verifier address');
  }
  return true;
};
