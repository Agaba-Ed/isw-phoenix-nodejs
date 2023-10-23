"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var express = require('express');

var ISW = require('./isw');

var App =
/*#__PURE__*/
function () {
  function App() {
    _classCallCheck(this, App);

    this.app = express();
    this.app.use(express.json());
    this.iswInstance = new ISW();
    this.initializeRoutes();
  }

  _createClass(App, [{
    key: "initializeRoutes",
    value: function initializeRoutes() {
      this.app.post('/validateCustomer', this.validateCustomer.bind(this));
      this.app.post('/categories-by-client', this.getBillerCategories.bind(this));
      this.app.get('/getcategoryBillers', this.getCategoryBillers.bind(this));
      this.app.post('/items', this.getPaymentItems.bind(this));
      this.app.post('/payment', this.payment.bind(this));
      this.app.post('/transStatus/:terminalId/:requestReference', this.transStatus.bind(this));
      this.app.post('/accountBalance', this.accountBalance.bind(this));
      this.app.get('/keyPair', this.generateRSAKeyPair.bind(this));
    }
  }, {
    key: "generateRSAKeyPair",
    value: function generateRSAKeyPair(req, res) {
      var responseData;
      return regeneratorRuntime.async(function generateRSAKeyPair$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              try {
                responseData = this.iswInstance.generateRSAKeyPair();
                console.log("certificate", responseData);
                res.send(responseData);
              } catch (error) {
                res.status(500).send(error);
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "accountBalance",
    value: function accountBalance(req, res) {
      var responseData;
      return regeneratorRuntime.async(function accountBalance$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.accountBalance(req.body));

            case 3:
              responseData = _context2.sent;
              res.send(responseData);
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              res.status(500).send(_context2.t0);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "transStatus",
    value: function transStatus(req, res) {
      var responseData;
      return regeneratorRuntime.async(function transStatus$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.transStatus(req.body));

            case 3:
              responseData = _context3.sent;
              res.send(responseData);
              _context3.next = 10;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](0);
              res.status(500).send(_context3.t0);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "validateCustomer",
    value: function validateCustomer(req, res) {
      var responseData;
      return regeneratorRuntime.async(function validateCustomer$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.validateCustomer(req.body));

            case 3:
              responseData = _context4.sent;
              res.send(responseData);
              _context4.next = 10;
              break;

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              res.status(500).send(_context4.t0);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "getBillerCategories",
    value: function getBillerCategories(req, res) {
      var responseData;
      return regeneratorRuntime.async(function getBillerCategories$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.GetBillerCategories());

            case 3:
              responseData = _context5.sent;
              res.send(responseData);
              _context5.next = 10;
              break;

            case 7:
              _context5.prev = 7;
              _context5.t0 = _context5["catch"](0);
              res.status(500).send(_context5.t0);

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "getCategoryBillers",
    value: function getCategoryBillers(req, res) {
      var responseData;
      return regeneratorRuntime.async(function getCategoryBillers$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.Getcategories());

            case 3:
              responseData = _context6.sent;
              res.send(responseData);
              _context6.next = 10;
              break;

            case 7:
              _context6.prev = 7;
              _context6.t0 = _context6["catch"](0);
              res.status(500).send(_context6.t0);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "getPaymentItems",
    value: function getPaymentItems(req, res) {
      var responseData;
      return regeneratorRuntime.async(function getPaymentItems$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.getPaymentItems(req.body));

            case 3:
              responseData = _context7.sent;
              res.send(responseData);
              _context7.next = 10;
              break;

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7["catch"](0);
              res.status(500).send(_context7.t0);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "payment",
    value: function payment(req, res) {
      var responseData;
      return regeneratorRuntime.async(function payment$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(this.iswInstance.payment(req.body));

            case 3:
              responseData = _context8.sent;
              res.send(responseData);
              _context8.next = 10;
              break;

            case 7:
              _context8.prev = 7;
              _context8.t0 = _context8["catch"](0);
              res.status(500).send(_context8.t0);

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this, [[0, 7]]);
    }
  }, {
    key: "startServer",
    value: function startServer(port) {
      this.app.listen(port, function () {
        console.log("Server is running on http://localhost:".concat(port));
      });
    }
  }]);

  return App;
}();

var appInstance = new App();
appInstance.startServer(3000);