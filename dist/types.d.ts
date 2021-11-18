import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
export declare type Address = string;
export declare type EthPowoMessage = {
    expires: string;
    verifierAddress: string;
};
export declare const defaultDomain: TypedDataDomain;
export declare const defaultTypes: Record<string, Array<TypedDataField>>;
export declare type CreatePowoOptions = {
    domain?: TypedDataDomain;
    types?: Record<string, TypedDataField[]>;
    verifierAddress: string;
};
export declare type VerifyPowoOptions = {
    domain?: TypedDataDomain;
    types?: Record<string, TypedDataField[]>;
    verifierAddress: string;
};
