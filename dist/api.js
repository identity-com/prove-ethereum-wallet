import { __awaiter, __generator } from "tslib";
import { verifyTypedData } from 'ethers/lib/utils';
import { defaultDomain, defaultTypes } from './types';
export var createPowo = function (signTypedData, _a) {
    var _b = _a.domain, domain = _b === void 0 ? defaultDomain : _b, _c = _a.types, types = _c === void 0 ? defaultTypes : _c, verifierAddress = _a.verifierAddress;
    return __awaiter(void 0, void 0, void 0, function () {
        var tokenDurationMs, expires, message, signature, msgString, messageB64, signatureB64;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tokenDurationMs = 1000 * 5 * 60;
                    expires = new Date(Date.now() + tokenDurationMs);
                    message = {
                        expires: expires.toISOString(),
                        verifierAddress: verifierAddress,
                    };
                    return [4 /*yield*/, signTypedData(domain, types, message)];
                case 1:
                    signature = _d.sent();
                    if (!signature)
                        throw new Error('Error creating powo');
                    msgString = JSON.stringify(message);
                    messageB64 = Buffer.from(msgString).toString('base64');
                    signatureB64 = Buffer.from(signature).toString('base64');
                    return [2 /*return*/, messageB64 + "." + signatureB64];
            }
        });
    });
};
export var verifyPowo = function (address, proof, _a) {
    var _b = _a.domain, domain = _b === void 0 ? defaultDomain : _b, _c = _a.types, types = _c === void 0 ? defaultTypes : _c, verifierAddress = _a.verifierAddress;
    return __awaiter(void 0, void 0, void 0, function () {
        var _d, message, signature, decodedSignature, decodedMessage, recoveredAddress;
        return __generator(this, function (_e) {
            console.log('verifyPowo raw', { address: address, proof: proof });
            _d = proof.split('.'), message = _d[0], signature = _d[1];
            decodedSignature = Buffer.from(signature, 'base64').toString();
            decodedMessage = JSON.parse(Buffer.from(message, 'base64').toString('utf-8'));
            console.log('verifyPowo decoded', { decodedSignature: decodedSignature, decodedMessage: decodedMessage });
            recoveredAddress = verifyTypedData(domain, types, decodedMessage, decodedSignature);
            if (recoveredAddress !== address) {
                throw new Error('Message was signed by unexpected wallet.');
            }
            if (new Date(decodedMessage.expires).getTime() < Date.now()) {
                throw new Error('Token Expired.');
            }
            if (decodedMessage.verifierAddress && verifierAddress && decodedMessage.verifierAddress !== verifierAddress) {
                throw new Error('Bad verifier address');
            }
            return [2 /*return*/, true];
        });
    });
};
//# sourceMappingURL=api.js.map