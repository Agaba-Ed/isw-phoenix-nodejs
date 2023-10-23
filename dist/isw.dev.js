"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

require('dotenv').config();

var crypto = require('crypto');

var Buffer = require('buffer').Buffer;

var axios = require('axios');

var ISW =
/*#__PURE__*/
function () {
  function ISW() {
    _classCallCheck(this, ISW);

    this.apiUrl = process.env.API_URL;
    this.clientId = process.env.CLIENT_ID;
    this.ownerPhoneNumber = process.env.OWNER_PHONE_NUMBER;
    this.passphrase = process.env.PASSPHRASE;
    this.privateKey = process.env.PRIVATE_KEY;
    this.clientSecretKey = process.env.clientSecretKey;
    this.terminalId = process.env.terminalId;
  }

  _createClass(ISW, [{
    key: "get",
    value: function get(url) {
      var params,
          timestamp,
          nonce,
          headers,
          _response,
          _args = arguments;

      return regeneratorRuntime.async(function get$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              params = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              console.log("url;", url);
              timestamp = new Date().toISOString();
              nonce = crypto.randomBytes(16).toString('hex');
              headers = {
                Authorization: this.generateAuthorizationHeader(this.clientId),
                Signature: this.generateSignatureHeader('GET', url, timestamp, nonce, this.clientId, this.clientSecretKey),
                'Content-Type': 'application/json'
              };
              _context.prev = 5;
              _context.next = 8;
              return regeneratorRuntime.awrap(axios.get("".concat(this.apiUrl).concat(url), {
                params: params,
                headers: headers
              }));

            case 8:
              _response = _context.sent;
              return _context.abrupt("return", _response.data);

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](5);
              console.error(_context.t0);
              throw _context.t0;

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[5, 12]]);
    }
  }, {
    key: "post",
    value: function post(url) {
      var data,
          timestamp,
          nonce,
          headers,
          _response2,
          _args2 = arguments;

      return regeneratorRuntime.async(function post$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              data = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              timestamp = new Date().toISOString();
              nonce = crypto.randomBytes(16).toString('hex');
              headers = {
                Authorization: this.generateAuthorizationHeader(this.clientId),
                Signature: this.generateSignatureHeader('POST', url, timestamp, nonce, this.clientId, this.clientSecretKey),
                'Content-Type': 'application/json'
              };
              _context2.prev = 4;
              _context2.next = 7;
              return regeneratorRuntime.awrap(axios.post("".concat(this.apiUrl).concat(url), data, {
                headers: headers
              }));

            case 7:
              _response2 = _context2.sent;
              return _context2.abrupt("return", _response2.data);

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](4);
              console.error(_context2.t0);

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[4, 11]]);
    }
  }, {
    key: "Getcategories",
    value: function Getcategories() {
      var url;
      return regeneratorRuntime.async(function Getcategories$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              url = "/qt-api/Biller/categories-by-client?clientTerminalId=".concat(this.terminalId, "&terminalId=").concat(this.terminalId);
              console.log("response==>", url);
              _context3.next = 4;
              return regeneratorRuntime.awrap(this.get(url));

            case 4:
              response = _context3.sent;
              console.log("response==>", response);
              return _context3.abrupt("return", response);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "GetcategoryBillers",
    value: function GetcategoryBillers(categoryId) {
      var url;
      return regeneratorRuntime.async(function GetcategoryBillers$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              url = "/qt-api/Biller/biller-by-category/".concat(categoryId);
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.get(url));

            case 3:
              response = _context4.sent;
              console.log("response==>", response);
              return _context4.abrupt("return", response);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "GetPaymentItems",
    value: function GetPaymentItems(billerId) {
      var url;
      return regeneratorRuntime.async(function GetPaymentItems$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              url = "/qt-api/Biller/items/biller-id/".concat(billerId);
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.get(url));

            case 3:
              response = _context5.sent;
              console.log("response==>", response);
              return _context5.abrupt("return", response);

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "accountBalance",
    value: function accountBalance(requestReference) {
      var url;
      return regeneratorRuntime.async(function accountBalance$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              url = "/api/v1/phoenix/sente/accountBalance?terminalId=".concat(this.terminalid, "&requestReference=").concat(requestReference);
              _context6.next = 3;
              return regeneratorRuntime.awrap(this.get(url));

            case 3:
              response = _context6.sent;
              console.log("response==>", response);
              return _context6.abrupt("return", response);

            case 6:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "transactionInformation",
    value: function transactionInformation(requestReference) {
      var url;
      return regeneratorRuntime.async(function transactionInformation$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              url = "/api/v1/phoenix/sente/transaction?terminalId=".concat(this.terminalid, "&requestReference=").concat(requestReference);
              _context7.next = 3;
              return regeneratorRuntime.awrap(this.get(url));

            case 3:
              response = _context7.sent;
              console.log("response==>", response);
              return _context7.abrupt("return", response);

            case 6:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "makePayment",
    value: function makePayment(data) {
      var paymentBody, url, _response3;

      return regeneratorRuntime.async(function makePayment$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              paymentBody = {
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
                "currencyCode": data.currencyCode
              };
              url = "/api/v1/phoenix/sente/xpayment";
              _context8.prev = 2;
              _context8.next = 5;
              return regeneratorRuntime.awrap(this.post(url, paymentBody));

            case 5:
              _response3 = _context8.sent;

              if (!(_response3.responseCode === '90000')) {
                _context8.next = 10;
                break;
              }

              return _context8.abrupt("return", _response3);

            case 10:
              throw _response3;

            case 11:
              _context8.next = 17;
              break;

            case 13:
              _context8.prev = 13;
              _context8.t0 = _context8["catch"](2);
              console.error(_context8.t0);
              throw _context8.t0;

            case 17:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this, [[2, 13]]);
    }
  }, {
    key: "validateCustomer",
    value: function validateCustomer(data) {
      var _this = this;

      return regeneratorRuntime.async(function validateCustomer$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", new Promise(function _callee(resolve, reject) {
                var url, customerValidationData, _response4;

                return regeneratorRuntime.async(function _callee$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        url = '/api/v1/phoenix/sente/customerValidation';
                        customerValidationData = {
                          "terminalId": _this.terminalId,
                          "requestReference": data.requestReference,
                          "paymentCode": data.paymentCode,
                          "customerId": data.customerId,
                          "currencyCode": data.currencyCode,
                          "amount": data.amount,
                          "alternateCustomerId": data.alternateCustomerId,
                          "customerToken": data.customerToken,
                          "transactionCode": data.transactionCode,
                          "additionalData": data.additionalData
                        };
                        _context9.prev = 2;
                        _context9.next = 5;
                        return regeneratorRuntime.awrap(_this.post(url, customerValidationData));

                      case 5:
                        _response4 = _context9.sent;

                        // Ensure you have a post method implemented
                        if (_response4.responseCode === '90000') {
                          resolve(_response4);
                        } else {
                          reject(_response4);
                        }

                        _context9.next = 13;
                        break;

                      case 9:
                        _context9.prev = 9;
                        _context9.t0 = _context9["catch"](2);
                        console.error(_context9.t0);
                        reject(_context9.t0);

                      case 13:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, null, null, [[2, 9]]);
              }));

            case 1:
            case "end":
              return _context10.stop();
          }
        }
      });
    }
  }, {
    key: "generateRSAKeyPair",
    value: function generateRSAKeyPair() {
      var generateKeyPairSync = crypto.generateKeyPairSync;

      var _generateKeyPairSync = generateKeyPairSync('rsa', {
        modulusLength: 2048
      }),
          publicKey = _generateKeyPairSync.publicKey,
          privateKey = _generateKeyPairSync.privateKey;

      return {
        publicKey: publicKey["export"]({
          type: 'pkcs1',
          format: 'pem'
        }),
        privateKey: privateKey["export"]({
          type: 'pkcs1',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: this.passphrase
        })
      };
    }
  }, {
    key: "generateECDHKeyPair",
    value: function generateECDHKeyPair() {
      var ecdh = crypto.createECDH('prime256v1');
      ecdh.generateKeys();
      return {
        publicKey: ecdh.getPublicKey('hex'),
        privateKey: ecdh.getPrivateKey('hex')
      };
    }
  }, {
    key: "decryptWithPrivateKey",
    value: function decryptWithPrivateKey(encryptedData) {
      var buffer = Buffer.from(encryptedData, 'base64');
      var decrypted = crypto.privateDecrypt({
        key: this.privateKey,
        // Ensure this property is set with your RSA private key
        passphrase: this.passphrase,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      }, buffer);
      return decrypted.toString();
    }
  }, {
    key: "createRSASignature",
    value: function createRSASignature(data) {
      var sign = crypto.createSign('RSA-SHA256');
      sign.update(data);
      sign.end();
      var signature = sign.sign({
        key: this.privateKey,
        passphrase: this.passphrase
      }, 'hex');
      return signature;
    }
  }, {
    key: "ecdhKeyExchange",
    value: function ecdhKeyExchange(privateKey, publicKey) {
      var ecdh = crypto.createECDH('prime256v1');
      ecdh.setPrivateKey(privateKey, 'hex');
      var sharedSecret = ecdh.computeSecret(publicKey, 'hex', 'hex');
      return sharedSecret;
    }
  }, {
    key: "encryptWithAES",
    value: function encryptWithAES(data, key, iv) {
      var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
      var encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher["final"]('hex');
      return encrypted;
    }
  }, {
    key: "generateAuthorizationHeader",
    value: function generateAuthorizationHeader(clientId) {
      var encodedClientId = Buffer.from(clientId).toString('base64');
      return "InterswitchAuth ".concat(encodedClientId);
    }
  }, {
    key: "generateSignatureHeader",
    value: function generateSignatureHeader(httpMethod, resourceUrl, timestamp, nonce, clientId, clientSecretKey) {
      var additionalParameters = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
      var baseString = httpMethod + '&' + encodeURIComponent(resourceUrl) + '&' + timestamp + '&' + nonce + '&' + clientId + '&' + clientSecretKey;

      if (additionalParameters) {
        baseString += '&' + additionalParameters.amount + '&' + additionalParameters.terminalId + '&' + additionalParameters.requestReference + '&' + additionalParameters.customerId + '&' + additionalParameters.paymentcode;
      }

      var sign = crypto.createSign('SHA256');
      sign.update(baseString);
      sign.end();
      var signature = sign.sign(this.privateKey, 'base64');
      return signature;
    }
  }, {
    key: "getAuthToken",
    value: function getAuthToken(authToken, sessionKey) {
      var iv = crypto.randomBytes(16);
      var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), iv);
      var encrypted = cipher.update(authToken, 'utf8', 'hex');
      encrypted += cipher["final"]('hex');
      var authTokenEncrypted = iv.toString('hex') + ':' + encrypted;
      return authTokenEncrypted;
    }
  }]);

  return ISW;
}();

module.exports = ISW; // Use CommonJS syntax for exporting the module