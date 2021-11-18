import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { CreatePowoOptions, EthPowoMessage, VerifyPowoOptions } from './types';
export declare const createPowo: (signTypedData: (domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: EthPowoMessage) => Promise<string>, { domain, types, verifierAddress }: CreatePowoOptions) => Promise<string>;
export declare const verifyPowo: (address: string, proof: string, { domain, types, verifierAddress }: VerifyPowoOptions) => Promise<boolean>;
