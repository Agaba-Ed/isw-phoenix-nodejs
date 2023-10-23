"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const Buffer = require('buffer').Buffer;
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const fs = __importStar(require("fs"));
const util = __importStar(require("util"));
const elliptic_1 = require("elliptic");
const writeFile = util.promisify(fs.writeFile);
const fss = __importStar(require("fs/promises"));
class ISW {
    constructor() {
        this.apiUrl = process.env.API_URL || '';
        this.clientId = process.env.CLIENT_ID || '';
        this.ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER || '';
        this.passphrase = process.env.PASSPHRASE || '';
        this.appVersion = process.env.APP_VERSION || '';
        this.clientSecretKey = process.env.CLIENT_SECRET_KEY || '';
        this.terminalId = process.env.TERMINAL_ID || '';
        this.serialId = process.env.serialId || '';
        this.initializeKeys();
    }
    initializeKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.privateKey = yield this.readFromFile('private.txt');
                this.publicKey = yield this.readFromFile('public.txt');
                this.authToken = yield this.readFromFile('authToken.txt');
                this.sessionKey = yield this.readFromFile('session.txt');
            }
            catch (error) {
                console.error('Error initializing keys:', error);
                // handle error, maybe set some defaults or throw
            }
        });
    }
    readFromFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fss.readFile(filePath, { encoding: 'utf8' });
                return data;
            }
            catch (error) {
                throw new Error(`Error reading from file: ${error}`);
            }
        });
    }
    get(url, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Starting get method');
            console.log('URL:', url);
            console.log('Params:', params);
            const timestamp = new Date().toISOString();
            console.log('Timestamp:', timestamp);
            const nonce = crypto_1.default.randomBytes(16).toString('hex');
            console.log('Nonce:', nonce);
            const authorizationHeader = this.generateAuthorizationHeader(this.clientId);
            console.log('Authorization Header:', authorizationHeader);
            const signatureHeader = this.generateSignatureHeader('GET', url, timestamp, nonce, this.clientId, this.clientSecretKey);
            console.log('Signature Header:', signatureHeader);
            // Construct headers object step by step
            const headers = {};
            headers['Authorization'] = authorizationHeader;
            headers['Signature'] = signatureHeader;
            headers['Content-Type'] = 'application/json';
            console.log('Constructed Headers:', headers);
            try {
                console.log('Sending GET request');
                const response = yield axios_1.default.get(`${this.apiUrl}${url}`, { params, headers });
                console.log('Received response:', response);
                const rsp = response.data;
                console.log('Response data:', rsp);
                return rsp;
            }
            catch (error) {
                console.error('Error in GET request:', error);
                throw error;
            }
        });
    }
    post(url, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("receivedPost", 1);
            const timestamp = new Date().toISOString();
            const nonce = crypto_1.default.randomBytes(16).toString('hex');
            url = `${this.apiUrl}${url}`;
            console.log("receivedPost", 2);
            const auth_token = this.getAuthToken(this.authToken, this.sessionKey);
            const signature = this.generateSignatureHeader('POST', url, timestamp, nonce, this.clientId, this.clientSecretKey);
            console.log("HeaderSignature", signature);
            const headers = {
                Authorization: this.generateAuthorizationHeader(this.clientId),
                Signature: signature,
                'Content-Type': 'application/json',
                Nonce: nonce,
                Timestamp: timestamp,
                authToken: auth_token
            };
            console.log("postData", url, JSON.stringify(data), { headers });
            try {
                const response = yield axios_1.default.post(url, JSON.stringify(data), { headers });
                return response.data; // Changed from 'response.response' to 'response.data'
            }
            catch (error) {
                console.error(error.response);
                let errorMessage;
                // Check HTTP status
                if (error.response && error.response.status) {
                    const status = error.response.status;
                    if (status >= 400 && status < 500) {
                        console.error('Client error:', status);
                        errorMessage = error.response.data.response;
                    }
                    else if (status >= 500) {
                        console.error('Server error:', status);
                        errorMessage = error.response.data.response;
                    }
                    else {
                        errorMessage = 'Unexpected error status';
                    }
                }
                else {
                    console.error('Unknown error:', error);
                    errorMessage = 'Unknown error occurred';
                }
                return { success: false, error: errorMessage };
            }
        });
    }
    Getcategories() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("cat==>", this.terminalId);
            const url = `/qt-api/Biller/categories-by-client?clientterminalId=${this.terminalId}&terminalId=${this.terminalId}`;
            const response = yield this.get(url);
            console.log("response==>", response);
            return response;
        });
    }
    GetBillerCategories(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/qt-api/Biller/biller-by-category/${categoryId}`;
            const response = yield this.get(url);
            console.log("response==>", response);
            return response;
        });
    }
    GetPaymentItems(billerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/qt-api/Biller/items/biller-id/${billerId}`;
            const response = yield this.get(url);
            console.log("response==>", response);
            return response;
        });
    }
    accountBalance(requestReference) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/api/v1/phoenix/sente/accountBalance?terminalId=${this.terminalId}&requestReference=${requestReference}`;
            const response = yield this.get(url);
            console.log("response==>", response);
            return response;
        });
    }
    transactionInformation(requestReference) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `/api/v1/phoenix/sente/transaction?terminalId=${this.terminalId}&requestReference=${requestReference}`;
            const response = yield this.get(url);
            console.log("response==>", response);
            return response;
        });
    }
    makePayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentBody = {
                "terminalId": this.terminalId,
                "requestReference": data.requestReference,
                "amount": data.amount,
                "customerId": data.customerId,
                "phoneNumber": data.phoneNumber,
                "paymentCode": data.paymentCode,
                "customerName": data.customerName,
                "sourceOfFunds": data.sourceOfFunds,
                "narration": data.narration,
                "depositorName": data.depositorName,
                "location": data.location,
                "alternateCustomerId": data.alternateCustomerId,
                "transactionCode": data.transactionCode,
                "customerToken": data.customerToken,
                "additionalData": data.additionalData,
                "collectionsAccountNumber": data.collectionsAccountNumber,
                "pin": data.pin,
                "otp": data.otp,
                "currencyCode": data.currencyCode,
            };
            const url = "/api/v1/phoenix/sente/xpayment";
            try {
                const response = yield this.post(url, paymentBody); // Ensure you have a post method implemented
                if (response.responseCode === '90000') {
                    return response;
                }
                else {
                    throw response;
                }
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    validateCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const url = '/api/v1/phoenix/sente/customerValidation';
                const customerValidationData = {
                    "terminalId": this.terminalId,
                    "requestReference": data.requestReference,
                    "paymentCode": data.paymentCode,
                    "customerId": data.customerId,
                    "currencyCode": data.currencyCode,
                    "amount": data.amount,
                    "alternateCustomerId": data.alternateCustomerId,
                    "customerToken": data.customerToken,
                    "transactionCode": data.transactionCode,
                    "additionalData": data.additionalData,
                };
                try {
                    const response = yield this.post(url, customerValidationData); // Ensure you have a post method implemented
                    if (response.responseCode === '90000') {
                        resolve(response);
                    }
                    else {
                        reject(response);
                    }
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
            }));
        });
    }
    generateRSAKeyPair() {
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        // Save the keys to files
        this.writeToFile('public.txt', publicKey);
        this.writeToFile('private.txt', privateKey);
        return {
            publicKey: publicKey.toString(),
            privateKey: privateKey.toString()
        };
    }
    generateECDHKeyPair() {
        const ec = new elliptic_1.ec('p256');
        const keyPair = ec.keyFromPrivate(crypto_1.default.randomBytes(32));
        const publicKeyBase64 = Buffer.from(keyPair.getPublic(true, 'hex'), 'hex').toString('base64');
        const privateKeyHex = keyPair.getPrivate('hex');
        return {
            publicKey: publicKeyBase64,
            privateKey: privateKeyHex,
        };
    }
    createRSASignature(data) {
        const sign = crypto_1.default.createSign("SHA256");
        sign.update(data);
        const signature = sign.sign({ key: this.privateKey }, 'base64');
        return signature;
    }
    ecdhKeyExchange(privateKey, publicKey) {
        const ecdh = crypto_1.default.createECDH('prime256v1');
        ecdh.setPrivateKey(privateKey, 'hex');
        const sharedSecret = ecdh.computeSecret(publicKey, 'hex', 'hex');
        return sharedSecret;
    }
    encryptWithAES(data, key, iv) {
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    generateAuthorizationHeader(clientId) {
        const encodedClientId = Buffer.from(clientId).toString('base64');
        return `InterswitchAuth ${encodedClientId}`;
    }
    generateSignatureHeader(httpMethod, resourceUrl, timestamp, nonce, clientId, clientSecretKey, additionalParameters = null) {
        const encodedURI = encodeURIComponent(resourceUrl);
        let baseString = httpMethod + '&' + encodedURI + '&' + timestamp + '&' + nonce + '&' + clientId + '&' + clientSecretKey;
        if (additionalParameters) {
            baseString += '&' + additionalParameters.amount + '&' + additionalParameters.terminalId + '&' + additionalParameters.requestReference + '&' + additionalParameters.customerId + '&' + additionalParameters.paymentcode;
        }
        try {
            const sign = crypto_1.default.createSign("SHA256");
            sign.update(baseString);
            const signature = sign.sign({ key: this.privateKey }, 'base64');
            return signature;
        }
        catch (error) {
            console.log("An error occurred while creating the signature:", error);
            return "";
        }
    }
    encryptPassword(password, sessionKey) {
        const sessionKeyBuffer = Buffer.from(sessionKey, 'hex');
        const hash = crypto_1.default.createHash('sha512');
        hash.update(password);
        const hashedPasswordHex = hash.digest('hex');
        const base64EncodedHash = Buffer.from(hashedPasswordHex, 'utf8').toString('base64');
        console.log("hashedPasswordHex", hashedPasswordHex);
        console.log("base64EncodedHash", base64EncodedHash);
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', sessionKeyBuffer, iv);
        let encrypted = cipher.update(base64EncodedHash, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    getAuthToken(authToken, sessionKey) {
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), iv);
        let encrypted = cipher.update(authToken, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTokenEncrypted = encrypted;
        return authTokenEncrypted;
    }
    clientRegistration(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const serialId = this.serialId;
            const requestReference = data.requestReference;
            const ecdHKeys = this.generateECDHKeyPair();
            const ecdhPublic = ecdHKeys.publicKey;
            const ecdhPrivate = ecdHKeys.privateKey;
            const payload = {
                terminalId: this.terminalId,
                appVersion: this.appVersion,
                serialId: serialId,
                requestReference: requestReference,
                gprsCoordinate: data.gprsCoordinate,
                name: data.name,
                phoneNumber: data.phoneNumber,
                nin: data.nin,
                Gender: data.gender,
                emailAddress: data.emailAddress,
                ownerPhoneNumber: data.ownerPhoneNumber,
                publicKey: this.publicKey,
                clientSessionPublicKey: ecdhPublic,
            };
            console.log("sendingClientData", payload);
            try {
                const response = yield this.post('/api/v1/phoenix/client/clientRegistration', payload);
                console.log("response", response);
                const responseCode = response.responseCode;
                if (responseCode == "90000") {
                    const data = response.response;
                    const serverSessionPublicKey = data.serverSessionPublicKey;
                    const transactionReference = data.transactionReference;
                    const authToken = data.authToken;
                    const decryptedAuthToken = this.decryptWithPrivateKey(authToken);
                    const decryptedServerSessionPublicKey = this.decryptWithPrivateKey(serverSessionPublicKey);
                    console.log("decryptedAuthToken", decryptedAuthToken);
                    console.log("decryptedServerSessionPublicKey", decryptedServerSessionPublicKey);
                    const sessionKey = this.deriveSessionKey(decryptedServerSessionPublicKey, ecdhPrivate);
                    console.log("sessionKey", sessionKey);
                    const completeRegResponse = yield this.completeClientRegistration(sessionKey, transactionReference, requestReference, serialId);
                    console.log("completeRegResponse", completeRegResponse);
                    const responseCodeCompleted = completeRegResponse.responseCode;
                    if (responseCodeCompleted == "90000") {
                        const responseData = completeRegResponse.response;
                        const clientSecret = responseData.clientSecret;
                        const newAuthToken = responseData.authToken;
                        const newDecryptedAuthToken = this.decryptWithPrivateKey(newAuthToken);
                        const decryptedClientSecret = this.decryptWithPrivateKey(clientSecret);
                        this.writeToFile('authToken.txt', newDecryptedAuthToken);
                        this.writeToFile('secrete.txt', decryptedClientSecret);
                        this.writeToFile('session.txt', sessionKey);
                        return completeRegResponse;
                    }
                }
                console.log(response); // Log the response for debugging
                return response; // Return the response
            }
            catch (error) {
                console.error('Error during client registration:', error); // Log any error that occurs
                throw error; // Re-throw the error after logging it
            }
        });
    }
    decryptWithPrivateKey(encryptedData) {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto_1.default.privateDecrypt({
            key: this.privateKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256' // Specify the hash function for OAEP
        }, buffer);
        return decrypted.toString();
    }
    decPassword(encryptedData) {
        const buffer = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto_1.default.privateDecrypt({
            key: this.sessionKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256' // Specify the hash function for OAEP
        }, buffer);
        return decrypted.toString();
    }
    deriveSessionKey(serverPublicKeyBase64, ecdhPrivate) {
        const ec = new elliptic_1.ec('p256');
        const yourKeyPair = ec.keyFromPrivate(ecdhPrivate, 'hex');
        const serverPublicKeyHex = Buffer.from(serverPublicKeyBase64, 'base64').toString('hex');
        const sessionKey = yourKeyPair.derive(ec.keyFromPublic(serverPublicKeyHex, 'hex').getPublic());
        return sessionKey.toString('hex');
    }
    signMessage(password, requestReference, serialId) {
        const message = password + requestReference + serialId;
        console.log("doKeyExchange conct String ==>", message);
        console.log("newString", message);
        const sign = crypto_1.default.createSign('SHA256');
        sign.update(message);
        const signature = sign.sign(this.privateKey, 'base64');
        return signature;
    }
    doKeyExchange() {
        return __awaiter(this, void 0, void 0, function* () {
            const ecdHKeys = this.generateECDHKeyPair();
            const publicKey = ecdHKeys.publicKey;
            const secKey = ecdHKeys.privateKey;
            const requestReference = crypto_1.default.randomBytes(16).toString('hex');
            const serialId = this.serialId;
            const pass = this.passphrase;
            console.log("doKeyExchange Raw password==>", pass);
            const hash = crypto_1.default.createHash('sha512');
            hash.update(this.passphrase);
            const hashedPasswordHex = hash.digest('hex');
            console.log("doKeyExchange 512 hashed password==>", hashedPasswordHex);
            const base64EncodedHash = Buffer.from(hashedPasswordHex, 'utf8').toString('base64');
            console.log("doKeyExchange base64EncodedHash password==>", base64EncodedHash);
            const password = this.signMessage(base64EncodedHash, requestReference, serialId);
            console.log("doKeyExchange COMPLETE password ==>", password);
            const payload = {
                terminalId: this.terminalId,
                appVersion: this.appVersion,
                serialId: this.serialId,
                requestReference: requestReference,
                clientSessionPublicKey: publicKey,
                password: password
            };
            console.log("payload", payload);
            try {
                const response = yield this.post('/api/v1/phoenix/client/doKeyExchange', payload);
                const responseCode = response.responseCode;
                if (responseCode == "90000") {
                    const data = response.response;
                    const serverSessionPublicKey = data.serverSessionPublicKey;
                    const transactionReference = data.transactionReference;
                    const authToken = data.authToken;
                    const decryptedAuthToken = this.decryptWithPrivateKey(authToken);
                    const decryptedServerSessionPublicKey = this.decryptWithPrivateKey(serverSessionPublicKey);
                    const sessionKey = this.deriveSessionKey(decryptedServerSessionPublicKey, secKey);
                    this.writeToFile("authToken.txt", decryptedAuthToken);
                    this.writeToFile("sessionKey.txt", sessionKey);
                    //   console.log("decryptedServerSessionPublicKey",sessionKey, decryptedAuthToken,  decryptedServerSessionPublicKey)
                }
                console.log(response);
                return response;
            }
            catch (error) {
                console.error('Error during key exchange:', error);
                throw error;
            }
        });
    }
    completeClientRegistration(sessionKey, transactionReference, requestReference, serialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                terminalId: this.terminalId,
                password: this.encryptPassword(this.passphrase, sessionKey),
                transactionReference: transactionReference,
                requestReference: requestReference,
                serialId: serialId,
            };
            try {
                const response = yield this.post('/api/v1/phoenix/client/completeClientRegistration', payload);
                console.log("completeReg1", response);
                return response; // Return the response
            }
            catch (error) {
                console.error('Error during complete client registration:', error); // Log any error that occurs
                throw error; // Re-throw the error after logging it
            }
        });
    }
    writeToFile(filePath, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield writeFile(filePath, data);
                return `Data successfully written to ${filePath}`;
            }
            catch (error) {
                throw new Error(`Error writing to file: ${error}`);
            }
        });
    }
}
exports.default = ISW;
