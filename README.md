# ISW Phoenix NodeJS Middleware

## Prerequisites
Before getting started, ensure that you have the following installed:
- **Node.js**: A JavaScript runtime required to execute the middleware.
- **npm (Node Package Manager)**: Used to manage dependencies.

## Installation
To install the required dependencies, run the following command in your project directory:
```bash
npm install
```

## Adding Credentials in .env
Before running the application, update the `.env` file with your credentials. These credentials are required for authentication and API communication. Replace `CLIENT_ID`, `CLIENT_SECRET_KEY`, `TERMINAL_ID`, and `PASSPHRASE` with your actual values.

Example `.env` file:
```
API_URL=https://dev.interswitch.io  # Base API URL for ISW Phoenix
#BILLERS_API_URL=https://dev.interswitch.io/gateway  # Alternative billers API URL
BILLERS_API_URL=https://iswapigateway-develop.azurewebsites.net/  # Gateway URL for billers
#API_URL=http://172.23.1.111:9087  # Local development API URL (if applicable)
OWNER_PHONE_NUMBER=0777245670  # Registered phone number associated with the account
CLIENT_ID=YOUR_CLIENT_ID  # Unique identifier for the client application
CLIENT_SECRET_KEY=YOUR_CLIENT_SECRET_KEY  # Secret key for authentication
TERMINAL_ID=YOUR_TERMINAL_ID  # Unique terminal ID for transactions
APP_VERSION=1  # Version number of the application
serialId=12345  # Unique serial ID for tracking requests
PASSPHRASE=YOUR_PASSPHRASE  # Secure passphrase for encryption and authentication
```

## Running the Middleware and Example Client

### Start the Middleware Server
To start the middleware server, run:
```bash
node app.js
```
This will initialize the middleware, making it ready to handle requests.

### Run the Example Client
To test the middleware using an example client, run:
```bash
node example_client.js
```
This will execute a sample request to validate the middleware functionality.

## Middleware Capabilities
The middleware provides the following key functionalities:
- **Client Registration**: Registers new clients with the system.
- **Key Exchange**: Facilitates secure key exchange between clients and the server.
- **Retrieve Categories**: Fetches available service categories from the API.
- **Get Billers by Category**: Lists billers associated with a specific category.
- **Retrieve Payment Items**: Fetches available payment items for a biller.
- **Make Payments**: Processes payments securely via the API.
- **Check Account Balance**: Retrieves the current balance of a specified account.

## Project Structure
- `isw.js`: Contains the core implementation of the middleware, including API interactions.
- `example_client.js`: Demonstrates how to interact with the middleware as a client.
- `app.js`: Initializes and configures the middleware server.

## Contributing
To contribute to this project, follow these steps:
1. **Fork the repository** to your GitHub account.
2. **Create a feature branch** for your changes.
3. **Commit your changes** with a descriptive message.
4. **Push to the branch** on your forked repository.
5. **Create a new Pull Request** to merge your changes into the main repository.

Your contributions are highly appreciated and help improve the middleware!
