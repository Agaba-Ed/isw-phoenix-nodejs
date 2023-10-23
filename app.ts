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
    this.app.post("/categories-by-client", this.getBillerCategories.bind(this));
    this.app.get("/getcategoryBillers", this.getCategoryBillers.bind(this));
    this.app.post("/items", this.getPaymentItems.bind(this));
    this.app.post("/payment", this.payment.bind(this));
    this.app.post(
      "/transStatus/:terminalId/:requestReference",
      this.transStatus.bind(this)
    );
    this.app.post("/accountBalance", this.accountBalance.bind(this));
    this.app.get("/keyPair", this.generateRSAKeyPair.bind(this));
    this.app.post("/clientRegistration", this.clientRegistration.bind(this));
    this.app.post("/doKeyExchange", this.doKeyExchange.bind(this));
    this.app.get("/generateECDHKeyPair", this.generateECDHKeyPair.bind(this));
    this.app.get("/util", this.util.bind(this));
  }

  async util(req: Request, res: Response) {
    try {
      var clientSecret ="XexmmksCp8fMwFEaetPq9UyFjF24PHtFs/wGiZBP14LNC5eIoiIOvrMLz5wxIU9SF5kSBu+1KCvxflDwyduOsFcdDABQaVte6qmJW3baL2VaHRPnNIArkPfxqei1phU4iZbvB3qGlI7FqFiXNInimJXssXgzaLl7T7flfcPaofwklf61SMbKSuWSlCqyDPHEKfrPrA/sRcDUrLJ1tN4dj1Kob8X0LcRUSwlGTDwwYMpyZa26GAR6QMEWwWR3cdK8reS8On64scskD+/+fIKn/HCMK/x+VMhfAfrRB14XhhmZfZz9xH10Bz+Q5Bnv4Seh9np6Wi1bRuV8app9m+8ong==";

      const responseData = this.iswInstance.decryptWithPrivateKey(clientSecret);
      console.log("certificate", responseData);
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
      const responseData = this.iswInstance.doKeyExchange();
      console.log("certificate", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async generateRSAKeyPair(req: Request, res: Response) {
    try {
      const responseData = this.iswInstance.generateRSAKeyPair();
      console.log("certificate", responseData);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async accountBalance(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.accountBalance(req.body);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async clientRegistration(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.clientRegistration(req.body);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async transStatus(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.transactionInformation(
        req.body
      );
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async validateCustomer(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.validateCustomer(req.body);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getBillerCategories(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.Getcategories();
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getCategoryBillers(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.Getcategories();
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getPaymentItems(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.GetPaymentItems(req.body);
      res.send(responseData);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async payment(req: Request, res: Response) {
    try {
      const responseData = await this.iswInstance.makePayment(req.body);
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
