"use strict";
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
const express_1 = __importDefault(require("express"));
const isw_1 = __importDefault(require("./isw"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.iswInstance = new isw_1.default();
        this.initializeRoutes();
    }
    //airtel 
    initializeRoutes() {
        this.app.post("/validateCustomer", this.validateCustomer.bind(this));
        this.app.get("/getbillerbycategory/:id", this.getBillerCategories.bind(this));
        this.app.get("/getcategories", this.Getcategories.bind(this));
        this.app.get("/billeritems/:id", this.getPaymentItems.bind(this));
        this.app.post("/payment", this.payment.bind(this));
        this.app.get("/transStatus/:id", this.transStatus.bind(this));
        this.app.get("/accountBalance", this.accountBalance.bind(this));
        this.app.get("/keyPair", this.generateRSAKeyPair.bind(this));
        this.app.post("/clientRegistration", this.clientRegistration.bind(this));
        this.app.post("/doKeyExchange", this.doKeyExchange.bind(this));
        this.app.get("/generateECDHKeyPair", this.generateECDHKeyPair.bind(this));
        this.app.get("/util", this.util.bind(this));
    }
    util(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var clientSecret = "zpRc8p/dlBKkizlvenLUh/evRn+2lW1FfCyRGx/SOAUMcxrkyzsNibQgAqv2seuGmObIE1e8IBzpiN+urx9b4mHv7Dm4GSjYNmLfMUfJom2q4ehDg7K6u/2Pm2hAu6yW3iH/UmQwbIElx4W06moXWugWQX0gvxXmv4UwCAwxYZBtTIIv8WQaP9j9PEQPHFmSqFXy2qJwij+ytpp5eHJ69WQs2Q0Vj0F3CkbYd1fvrNRlTCgXqJy1v9dw5lOpyhYL7m76P1v8Xnz9C1CkCPmlQ0XXNa0wt85kbpmg66kTtcOpLNP/qZHjHTJy1I+BpdCEULV203KqjiirSmNlhJiCxQ==";
                const responseData = this.iswInstance.decryptWithPrivateKey(clientSecret);
                console.log("Response::", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    generateECDHKeyPair(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = this.iswInstance.generateECDHKeyPair();
                console.log("certificate", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    doKeyExchange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.doKeyExchange();
                console.log("Response:: ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    generateRSAKeyPair(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = this.iswInstance.generateRSAKeyPair();
                console.log("Key Pair ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    accountBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.accountBalance();
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    clientRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.clientRegistration(req.body);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    transStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const txId = req.params.id;
                const responseData = yield this.iswInstance.transactionInquiry(txId);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    validateCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.validateCustomer(req.body);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    getBillerCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const catId = req.params.id;
                const responseData = yield this.iswInstance.GetCategoryBillers(catId);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    Getcategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.Getcategories();
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    getPaymentItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const billerId = req.params.id;
                const responseData = yield this.iswInstance.GetPaymentItems(billerId);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    payment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.makePayment(req.body);
                console.log("Response ", responseData);
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    startServer(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}
const appInstance = new App();
appInstance.startServer(3000);
