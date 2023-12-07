import crypto from "crypto";
const Buffer = require("buffer").Buffer;
import axios from "axios";
import "dotenv/config";
import * as fs from "fs";
import * as util from "util";
import { ec as EC } from "elliptic";

const writeFile = util.promisify(fs.writeFile);
import * as fss from "fs/promises";

class ISW {

  apiUrl: string;
  clientId: string;
  ownerPhoneNumber: string;
  passphrase: string;
  privateKey: any;
  publicKey: any;
  clientSecretKey: string;
  terminalId: string;
  appVersion: string;
  serialId: string;
  authToken: any;
  sessionKey: any;

  constructor() {

    this.apiUrl = process.env.API_URL || "";
    this.clientId = process.env.CLIENT_ID || "";
    this.ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER || "";
    this.passphrase = process.env.PASSPHRASE || "";
    this.appVersion = process.env.APP_VERSION || "";
    this.clientSecretKey = process.env.CLIENT_SECRET_KEY || "";
    this.terminalId = process.env.TERMINAL_ID || "";
    this.serialId = process.env.serialId || "";

    this.initializeKeys();
  }

  //Load saved key values
  async initializeKeys() {

    try {
      this.privateKey = await this.readFromFile("private.txt");
      this.publicKey = await this.readFromFile("public.txt");
      this.authToken = await this.readFromFile("authToken.txt");
      this.sessionKey = await this.readFromFile("sessionKey.txt");
    }
    catch (error) {
      console.error("Error initializing keys:", error);
      // handle error, maybe set some defaults or throw
    }

  }



  async writeToFile(filePath: string, data: any) {
    filePath = `./isw/${filePath}`
    try {
      await writeFile(filePath, data);
      return `Data successfully written to ${filePath}`;
    }
    catch (error) {
      throw new Error(`Error writing to file: ${error}`);
    }

  }


  async readFromFile(filePath: string): Promise<string> {
    try {
      filePath = `./isw/${filePath}`
      const data = await fss.readFile(filePath, { encoding: "utf8" });
      return data;
    } catch (error) {
      throw new Error(`Error reading from file: ${error}`);
    }
  }

  async get(url: any, params = {}) {

    console.log("Starting get method");
    console.log("URL:", url);
    console.log("Params:", params);

    console.log("newURL:", url);
    const auth_token = this.getAuthToken(this.authToken, this.sessionKey);

    const timestamp = new Date().toISOString();
    console.log("Timestamp:", timestamp);
    url = `${this.apiUrl}${url}`;

    const nonce = crypto.randomBytes(16).toString("hex");
    console.log("Nonce:", nonce);

    const authorizationHeader = this.generateAuthorizationHeader(this.clientId);
    console.log("Authorization Header:", authorizationHeader);

    const signatureHeader = this.generateSignatureHeader(
      "GET",
      url,
      timestamp,
      nonce,
      this.clientId,
      this.clientSecretKey
    );

    console.log("Signature Header:", signatureHeader);

    // Construct headers object step by step
    const headers = {
      Authorization: this.generateAuthorizationHeader(this.clientId),
      Signature: signatureHeader,
      "Content-Type": "application/json",
      Nonce: nonce,
      Timestamp: timestamp,
      AuthToken: auth_token,
    };

    console.log("Constructed Headers:", headers);

    try {

      console.log("Sending GET request");
      const response = await axios.get(url, {
        params,
        headers,
      });
      console.log("Received response:", response);
      const rsp = response.data;
      console.log("Response data:", rsp);
      return rsp;

    } catch (error) {
      console.error("Error in GET request:", error);
      throw error;
    }
  }

  async post(url: string, data = {}, additionalParameters: any = null) {

    console.log("receivedPost", 1);
    const timestamp = new Date().toISOString();
    const nonce = crypto.randomBytes(16).toString("hex");
    url = `${this.apiUrl}${url}`;

    console.log("receivedPost", 2);
    const auth_token = this.getAuthToken(this.authToken, this.sessionKey);

    const signature = this.generateSignatureHeader(
      "POST",
      url,
      timestamp,
      nonce,
      this.clientId,
      this.clientSecretKey,
      additionalParameters
    );

    console.log("HeaderSignature", signature);

    const headers = {
      Authorization: this.generateAuthorizationHeader(this.clientId),
      Signature: signature,
      "Content-Type": "application/json",
      Nonce: nonce,
      Timestamp: timestamp,
      AuthToken: auth_token,
    };

    console.log("postData", url, JSON.stringify(data), { headers });

    try {
      const response: any = await axios.post(url, JSON.stringify(data), {
        headers,
      });
      return response.data; // Changed from 'response.response' to 'response.data'
    } catch (error: any) {
      console.error(error.response);

      let errorMessage: string;

      // Check HTTP status
      if (error.response && error.response.status) {

        const status = error.response.status;

        if (status >= 400 && status < 500) {
          console.error("Client error:", status);
          errorMessage = error.response.data.response;
        }
        else if (status >= 500) {
          console.error("Server error:", status);
          errorMessage = error.response.data.response;
        }
        else {
          errorMessage = "Unexpected error status";
        }

      } else {
        console.error("Unknown error:", error);
        errorMessage = "Unknown error occurred";
      }

      return { success: false, error: errorMessage };
    }
  }


  //Genrtae Key Pair
  generateRSAKeyPair() {

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {

      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },

    });

    // Save the keys to files
    this.writeToFile("public.txt", publicKey);
    this.writeToFile("private.txt", privateKey);
    return {
      publicKey: publicKey.toString(),
      privateKey: privateKey.toString(),
    };
  }

  generateECDHKeyPair() {

    const ec = new EC("p256");
    const keyPair = ec.keyFromPrivate(crypto.randomBytes(32));

    const publicKeyBase64 = Buffer.from(
      keyPair.getPublic(true, "hex"),
      "hex"
    ).toString("base64");

    const privateKeyHex = keyPair.getPrivate("hex");

    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyHex,
    };
  }

  ecdhKeyExchange(privateKey: any, publicKey: any) {
    const ecdh = crypto.createECDH("prime256v1");
    ecdh.setPrivateKey(privateKey, "hex");
    const sharedSecret = ecdh.computeSecret(publicKey, "hex", "hex");
    return sharedSecret;
  }

  generateAuthorizationHeader(clientId: any) {
    const encodedClientId = Buffer.from(clientId).toString("base64");
    return `InterswitchAuth ${encodedClientId}`;
  }

  generateSignatureHeader(
    httpMethod: any,
    resourceUrl: string,
    timestamp: string,
    nonce: string,
    clientId: string,
    clientSecretKey: string,
    additionalParameters: any = null
  ) {

    const encodedURI = encodeURIComponent(resourceUrl);

    let baseString =
      httpMethod +
      "&" + encodedURI +
      "&" + timestamp +
      "&" + nonce +
      "&" + clientId +
      "&" + clientSecretKey;


    if (additionalParameters) {
      baseString += "&" + additionalParameters.amount +
        "&" + additionalParameters.terminalId +
        "&" + additionalParameters.requestReference +
        "&" + additionalParameters.customerId +
        "&" + additionalParameters.paymentCode;
    }

    console.log("additionalParameters",additionalParameters )
    console.log("baseString",baseString )
    try {

      return this.signMessage(baseString);

    } catch (error) {
      console.log("An error occurred while creating the signature:", error);
      return "";
    }
  }

  encryptAuthToken(authToken: string, sessionKey: string): string {

    const iv = Buffer.alloc(16, 0);
    const sessionKeyBuffer = Buffer.from(sessionKey, "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", sessionKeyBuffer, iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(authToken, "utf8", "base64");
    encrypted += cipher.final("base64");

    let combinedBuffer = [];
    combinedBuffer.push(iv);
    combinedBuffer.push(Buffer.from(encrypted, 'base64'));
    let finalEncr = Buffer.concat(combinedBuffer);

    return finalEncr.toString('base64');

  }

  //encrypt password using sessionKey
  encryptPassword(password: string, sessionKey: string): string {

    const sessionKeyBuffer = Buffer.from(sessionKey, "hex");
    const hash = crypto.createHash("sha512");
    hash.update(password, 'utf-8');

    const hashedPasswordHex = hash.digest("hex");
    const base64EncodedHash = Buffer.from(hashedPasswordHex, "hex").toString("base64");

    console.log("hashedPasswordHex", hashedPasswordHex);
    console.log("base64EncodedHash", base64EncodedHash);
    const iv = Buffer.alloc(16, 0);

    const cipher = crypto.createCipheriv("aes-256-cbc", sessionKeyBuffer, iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(base64EncodedHash, "utf8", "base64");
    encrypted += cipher.final("base64");

    let combinedBuffer = [];
    combinedBuffer.push(iv);
    combinedBuffer.push(Buffer.from(encrypted, 'base64'));
    let finalEncr = Buffer.concat(combinedBuffer);

    return finalEncr.toString('base64');

  }

  //decrypt authToken using sessionKey
  getAuthToken(authToken: any, sessionKey: any) {
    return this.encryptAuthToken(authToken, sessionKey)

    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(sessionKey, "hex"),
      iv
    );

    let encrypted = cipher.update(authToken, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTokenEncrypted = encrypted;
    return authTokenEncrypted;
  }


  //decrypt value using privateKey
  decryptWithPrivateKey(encryptedData: any) {

    const buffer = Buffer.from(encryptedData, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256", // Specify the hash function for OAEP
      },
      buffer
    );

    return decrypted.toString();
  }

  //use  serversessionPublic  to generate ECDH sessionKey
  doECDH(serverPublicKeyBase64: any, ecdhPrivate: any) {

    const ec = new EC("p256");
    const yourKeyPair = ec.keyFromPrivate(ecdhPrivate, "hex");
    const serverPublicKeyHex = Buffer.from(
      serverPublicKeyBase64,
      "base64"
    ).toString("hex");

    const sessionKey = yourKeyPair.derive(
      ec.keyFromPublic(serverPublicKeyHex, "hex").getPublic()
    );

    return sessionKey.toString("hex");

  }

  //Sign data using private key
  signMessage(message: string) {

    console.log("doKeyExchange conct String ==>", message);

    console.log("newString", message);
    const sign = crypto.createSign("rsa-sha256");//Changed from SHA256
    sign.update(message);
    const signature = sign.sign(this.privateKey, "base64");
    return signature;
  }


  //INITIATE CLIENT REGISTRATION

  async clientRegistration(data: any) {

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

      const response = await this.post(
        "/api/v1/phoenix/client/clientRegistration",
        payload
      );

      console.log("response", response);
      const responseCode = response.responseCode;

      if (responseCode == "90000") {

        const data = response.response;
        const serverSessionPublicKey = data.serverSessionPublicKey;
        const transactionReference = data.transactionReference;
        const authToken = data.authToken;
        const decryptedAuthToken = this.decryptWithPrivateKey(authToken);
        const decryptedServerSessionPublicKey = this.decryptWithPrivateKey(
          serverSessionPublicKey
        );

        console.log("decryptedAuthToken", decryptedAuthToken);
        console.log(
          "decryptedServerSessionPublicKey",
          decryptedServerSessionPublicKey
        );

        const sessionKey = this.doECDH(
          decryptedServerSessionPublicKey,
          ecdhPrivate
        );

        console.log("sessionKey", sessionKey);

        const completeRegResponse = await this.completeClientRegistration(
          sessionKey,
          transactionReference,
          requestReference,
          serialId
        );

        console.log("completeRegResponse", completeRegResponse);
        const responseCodeCompleted = completeRegResponse.responseCode;

        if (responseCodeCompleted == "90000") {

          const responseData = completeRegResponse.response;
          const clientSecret = responseData.clientSecret;
          const newAuthToken = responseData.authToken;

          const newDecryptedAuthToken = this.decryptWithPrivateKey(newAuthToken);
          const decryptedClientSecret = this.decryptWithPrivateKey(clientSecret);

          console.log('sessionKey', sessionKey);

          this.writeToFile("authToken.txt", newDecryptedAuthToken);
          this.writeToFile("secrete.txt", decryptedClientSecret);
          this.writeToFile("sessionKey.txt", sessionKey);
          //return decrypted secret or simply restart app to pickup new one from file
          completeRegResponse.DECRYPTED_SECRET = decryptedClientSecret;
          this.initializeKeys();
          return completeRegResponse;
        }

      }

      console.log(response); // Log the response for debugging

      return response; // Return the response
    } catch (error) {
      console.error("Error during client registration:", error); // Log any error that occurs
      throw error; // Re-throw the error after logging it
    }
  }


  //COMPLETE REGISTRATION

  async completeClientRegistration(
    sessionKey: any,
    transactionReference: string,
    requestReference: string,
    serialId: string
  ) {

    const payload = {
      terminalId: this.terminalId,
      password: this.encryptPassword(this.passphrase, sessionKey),
      transactionReference: transactionReference,
      requestReference: requestReference,
      serialId: serialId,
    };

    try {

      const response = await this.post(
        "/api/v1/phoenix/client/completeClientRegistration",
        payload
      );

      console.log("completeReg1", response);
      return response; // Return the response

    } catch (error) {
      console.error("Error during complete client registration:", error); // Log any error that occurs
      throw error; // Re-throw the error after logging it
    }
  }


  //KEY EXCHNAGE

  async doKeyExchange() {

    const ecdHKeys = this.generateECDHKeyPair();
    const publicKey = ecdHKeys.publicKey;
    const privateKey = ecdHKeys.privateKey;

    const requestReference = crypto.randomBytes(16).toString("hex");
    const serialId = this.serialId;

    const pass = this.passphrase;
    console.log("doKeyExchange Raw password==>", pass);

    const hash = crypto.createHash('sha512');
    hash.update(pass);
    const base64EncodedHash = hash.digest('base64');

    console.log("doKeyExchange 512 hashed password==>", base64EncodedHash);

    console.log(
      "doKeyExchange base64EncodedHash password==>",
      base64EncodedHash
    );

    const passwordCipher = base64EncodedHash + requestReference + serialId;
    const password = this.signMessage(passwordCipher);

    console.log("doKeyExchange COMPLETE password ==>", password);

    const payload = {
      terminalId: this.terminalId,
      appVersion: this.appVersion,
      serialId: this.serialId,
      requestReference: requestReference,
      clientSessionPublicKey: publicKey,
      password: password,
    };

    console.log("payload", payload);

    try {
      const response = await this.post(
        "/api/v1/phoenix/client/doKeyExchange",
        payload
      );

      const responseCode = response.responseCode;

      if (responseCode == "90000") {

        const data = response.response;
        const serverSessionPublicKey = data.serverSessionPublicKey;
        const transactionReference = data.transactionReference;
        const authToken = data.authToken;
        const decryptedAuthToken = this.decryptWithPrivateKey(authToken);

        const decryptedServerSessionPublicKey = this.decryptWithPrivateKey(
          serverSessionPublicKey
        );

        const sessionKey = this.doECDH(
          decryptedServerSessionPublicKey,
          privateKey
        );

        this.writeToFile("authToken.txt", decryptedAuthToken);
        this.writeToFile("sessionKey.txt", sessionKey);

        this.initializeKeys();

      }

      console.log("Key Exchange Response", response);
      return response;
    }
    catch (error) {

      console.error("Error during key exchange:", error);
      throw error;
    }
  }

  //GET Biller Categories
  async Getcategories() {
    console.log("Getcategories==>", this.terminalId);
    const url = `/gateway/qt-api/Biller/categories-by-client/${this.terminalId}/${this.terminalId}`;
    const response = await this.get(url);
    console.log("response==>", response);
    return response;
  }


  //GET  Category Billers
  async GetCategoryBillers(categoryId: string) {
    const url = `/gateway/qt-api/Biller/biller-by-category/${categoryId}`;
    const response = await this.get(url);
    console.log("response==>", response);
    return response;
  }


  //GET  Billers Payment Items
  async GetPaymentItems(billerId: string) {
    const url = `/gateway/qt-api/Biller/items/biller-id/${billerId}`;
    const response = await this.get(url);
    console.log("response==>", response);
    return response;
  }

  //Check Account Balance
  async accountBalance(requestReference: string) {
    const url = `/api/v1/phoenix/sente/accountBalance/${this.terminalId}/${requestReference}`;
    const response = await this.get(url);
    console.log("response==>", response);
    return response;
  }

  //Check Transaction Details/Status
  async transactionInquiry(id: string) {
    const url = `/api/v1/phoenix/sente/status?terminalId=${this.terminalId}&requestReference=${id}`;
    const response = await this.get(url);
    console.log("response==>", response);
    return response;
  }

  //Make Validate Customer
  //RequestReference used here should be the same at /payment. 

  async validateCustomer(data: any) {

    return new Promise(async (resolve, reject) => {
      const url = "/api/v1/phoenix/sente/customerValidation";
      const customerValidationData = {
        terminalId: this.terminalId,
        requestReference: data.requestReference,
        paymentCode: data.paymentCode,
        customerId: data.customerId,
        currencyCode: data.currencyCode,
        amount: data.amount,
        alternateCustomerId: data.alternateCustomerId,
        customerToken: data.customerToken,
        transactionCode: data.transactionCode,
        additionalData: data.additionalData,
      };
      try {
        const response = await this.post(url, customerValidationData); // Ensure you have a post method implemented
        if (response.responseCode === "90000") {
          resolve(response);
        } else {
          reject(response);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }


  //Make Express Payment
  //For none-express payments , call "/api/v1/phoenix/sente/payment" (requests customer validation)
  async makePayment(data: any) {
    const paymentBody = {
      terminalId: this.terminalId,
      requestReference: data.requestReference,
      amount: data.amount,
      customerId: data.customerId,
      phoneNumber: data.phoneNumber,
      paymentCode: data.paymentCode,
      customerName: data.customerName,
      sourceOfFunds: data.sourceOfFunds,
      narration: data.narration,
      depositorName: data.depositorName,
      location: data.location,
      alternateCustomerId: data.alternateCustomerId,
      transactionCode: data.transactionCode,
      customerToken: data.customerToken,
      additionalData: data.additionalData,
      collectionsAccountNumber: data.collectionsAccountNumber,
      pin: data.pin,
      otp: data.otp,
      currencyCode: data.currencyCode,
    };

    const url = "/api/v1/phoenix/sente/xpayment";

    try {
      const response = await this.post(url, paymentBody, paymentBody); // Ensure you have a post method implemented
      if (response.responseCode === "90000") {
        return response;
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }




}


export default ISW;
