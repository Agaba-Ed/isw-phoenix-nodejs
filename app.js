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
    initializeRoutes() {
        this.app.post("/validateCustomer", this.validateCustomer.bind(this));
        this.app.post("/categories-by-client", this.getBillerCategories.bind(this));
        this.app.get("/getcategoryBillers", this.getCategoryBillers.bind(this));
        this.app.post("/items", this.getPaymentItems.bind(this));
        this.app.post("/payment", this.payment.bind(this));
        this.app.post("/transStatus/:terminalId/:requestReference", this.transStatus.bind(this));
        this.app.post("/accountBalance", this.accountBalance.bind(this));
        this.app.get("/keyPair", this.generateRSAKeyPair.bind(this));
        this.app.post("/clientRegistration", this.clientRegistration.bind(this));
        this.app.post("/doKeyExchange", this.doKeyExchange.bind(this));
        this.app.get("/generateECDHKeyPair", this.generateECDHKeyPair.bind(this));
        this.app.get("/util", this.util.bind(this));
    }
    util(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var clientSecret = "XexmmksCp8fMwFEaetPq9UyFjF24PHtFs/wGiZBP14LNC5eIoiIOvrMLz5wxIU9SF5kSBu+1KCvxflDwyduOsFcdDABQaVte6qmJW3baL2VaHRPnNIArkPfxqei1phU4iZbvB3qGlI7FqFiXNInimJXssXgzaLl7T7flfcPaofwklf61SMbKSuWSlCqyDPHEKfrPrA/sRcDUrLJ1tN4dj1Kob8X0LcRUSwlGTDwwYMpyZa26GAR6QMEWwWR3cdK8reS8On64scskD+/+fIKn/HCMK/x+VMhfAfrRB14XhhmZfZz9xH10Bz+Q5Bnv4Seh9np6Wi1bRuV8app9m+8ong==";
                const responseData = this.iswInstance.decryptWithPrivateKey(clientSecret);
                console.log("certificate", responseData);
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
                const responseData = this.iswInstance.doKeyExchange();
                console.log("certificate", responseData);
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
                console.log("certificate", responseData);
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
                const responseData = yield this.iswInstance.accountBalance(req.body);
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
                const responseData = yield this.iswInstance.transactionInformation(req.body);
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
                const responseData = yield this.iswInstance.Getcategories();
                res.send(responseData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    getCategoryBillers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const responseData = yield this.iswInstance.Getcategories();
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
                const responseData = yield this.iswInstance.GetPaymentItems(req.body);
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
