import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { verifyTypedData } from 'ethers/lib/utils';
import { CreatePowoOptions, defaultDomain, defaultTypes, EthPowoMessage, VerifyPowoOptions } from './types';

export const createPowo = async (
  signTypedData: (
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: EthPowoMessage
  ) => Promise<string>,
  { domain = defaultDomain, types = defaultTypes, verifierAddress }: CreatePowoOptions
): Promise<string> => {
  const tokenDurationMs = 1000 * 5 * 60; // 5 minutes
  const expires = new Date(Date.now() + tokenDurationMs);
  const message: EthPowoMessage = {
    expires: expires.toISOString(),
    verifierAddress,
  };
  const signature = await signTypedData(domain, types, message);
  if (!signature) throw new Error('Error creating powo');

  const msgString = JSON.stringify(message);
  const messageB64 = Buffer.from(msgString).toString('base64');
  const signatureB64 = Buffer.from(signature).toString('base64');
  return `${messageB64}.${signatureB64}`;
};

export const verifyPowo = async (
  address: string,
  proof: string,
  { domain = defaultDomain, types = defaultTypes, verifierAddress }: VerifyPowoOptions
): Promise<boolean> => {
  console.log('verifyPowo raw', { address, proof });
  const [message, signature] = proof.split('.');
  const decodedSignature = Buffer.from(signature, 'base64').toString();
  const decodedMessage = JSON.parse(Buffer.from(message, 'base64').toString('utf-8')) as EthPowoMessage;

  console.log('verifyPowo decoded', { decodedSignature, decodedMessage });
  const recoveredAddress = verifyTypedData(domain, types, decodedMessage, decodedSignature);
  if (recoveredAddress !== address) {
    throw new Error('Message was signed by unexpected wallet.');
  }

  if (new Date(decodedMessage.expires).getTime() < Date.now()) {
    throw new Error('Token Expired.');
  }

  if (decodedMessage.verifierAddress && verifierAddress && decodedMessage.verifierAddress !== verifierAddress) {
    throw new Error('Bad verifier address');
  }
  return true;
};
