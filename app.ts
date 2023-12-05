import express, { Request, Response } from "express";
import ISW from "./isw";

class App {
  private app: express.Express;
  private iswInstance: ISW;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.iswInstance = new ISW();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.app.post("/validateCustomer", this.validateCustomer.bind(this));
    this.app.get("/categories-by-client", this.getBillerCategories.bind(this));
    this.app.get("/getcategoryBillers", this.getCategoryBillers.bind(this));
    this.app.get("/items", this.getPaymentItems.bind(this));
    this.app.post("/payment", this.payment.bind(this));
    this.app.get(
      "/transStatus/:terminalId/:requestReference",
      this.transStatus.bind(this)
    );
    this.app.get("/accountBalance", this.accountBalance.bind(this));
    this.app.get("/keyPair", this.generateRSAKeyPair.bind(this));
    this.app.post("/clientRegistration", this.clientRegistration.bind(this));
    this.app.post("/doKeyExchange", this.doKeyExchange.bind(this));
    this.app.get("/generateECDHKeyPair", this.generateECDHKeyPair.bind(this));
    this.app.get("/util", this.util.bind(this));
  }

  async util(req: Request, res: Response) {
    try {
      var clientSecret ="zpRc8p/dlBKkizlvenLUh/evRn+2lW1FfCyRGx/SOAUMcxrkyzsNibQgAqv2seuGmObIE1e8IBzpiN+urx9b4mHv7Dm4GSjYNmLfMUfJom2q4ehDg7K6u/2Pm2hAu6yW3iH/UmQwbIElx4W06moXWugWQX0gvxXmv4UwCAwxYZBtTIIv8WQaP9j9PEQPHFmSqFXy2qJwij+ytpp5eHJ69WQs2Q0Vj0F3CkbYd1fvrNRlTCgXqJy1v9dw5lOpyhYL7m76P1v8Xnz9C1CkCPmlQ0XXNa0wt85kbpmg66kTtcOpLNP/qZHjHTJy1I+BpdCEULV203KqjiirSmNlhJiCxQ==";

      const responseData = this.iswInstance.decryptWithPrivateKey(clientSecret);
      console.log("Response::", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async generateECDHKeyPair(req: Request, res: Response) {
    try {
      const responseData = this.iswInstance.generateECDHKeyPair();
      console.log("certificate", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }


  async doKeyExchange(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.doKeyExchange();
      console.log("Response:: ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async generateRSAKeyPair(req: Request, res: Response) {
    try {
      const responseData = this.iswInstance.generateRSAKeyPair();
      console.log("Key Pair ", responseData);
      res.send(responseData);
    } 
    catch (error) {
      res.status(500).send(error);
    }
  }

  async accountBalance(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.accountBalance(req.body);
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async clientRegistration(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.clientRegistration(req.body);
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async transStatus(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.transactionInquiry(
        req.body
      );
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async validateCustomer(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.validateCustomer(req.body);
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getBillerCategories(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.Getcategories();
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getCategoryBillers(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.Getcategories();
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getPaymentItems(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.GetPaymentItems(req.body);
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async payment(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.makePayment(req.body);
      console.log("Response ", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  startServer(port: any) {
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }
}

const appInstance = new App();
appInstance.startServer(3000);
