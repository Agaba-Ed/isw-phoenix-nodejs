const axios = require('axios');
const baseURL = 'http://localhost:3000';

// 1. Client Registration
const registerClient = async () => {
    const registrationData = {
        requestReference: crypto.randomUUID(),
        gprsCoordinate: "1.234,5.678",
        name: "Test user",
        phoneNumber: "877889975",
        nin: "CM6567JNJF",
        gender: "M",
        emailAddress: "testusr.gmail.com",
        ownerPhoneNumber: "5877889975"  
    };

    try {
        const response = await axios.post(`${baseURL}/clientRegistration`, registrationData);
        console.log('Registration Response:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
};

// 2. Key Exchange
const doKeyExchange = async () => {
    try {
        const response = await axios.post(`${baseURL}/doKeyExchange`);
        console.log('Key Exchange Response:', response.data);
    } catch (error) {
        console.error('Key Exchange failed:', error.response?.data || error.message);
    }
};

// 3. Get Categories
const getCategories = async () => {
    try {
        const response = await axios.get(`${baseURL}/getcategories`);
        console.log('Categories:', response.data);
    } catch (error) {
        console.error('Failed to get categories:', error.response?.data || error.message);
    }
};

// 4. Get Billers by Category
const getBillersByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${baseURL}/getbillerbycategory/${categoryId}`);
        console.log('Billers:', response.data);
    } catch (error) {
        console.error('Failed to get billers:', error.response?.data || error.message);
    }
};

// 5. Get Payment Items
const getPaymentItems = async (billerId) => {
    try {
        const response = await axios.get(`${baseURL}/billeritems/${billerId}`);
        console.log('Payment Items:', response.data);
    } catch (error) {
        console.error('Failed to get payment items:', error.response?.data || error.message);
    }
};

// 6. Make Payment
const makePayment = async () => {
    const paymentData = {
        requestReference: "PAY" + Date.now(),
        amount: "1000",
        customerId: "CUST123",
        phoneNumber: "1234567890",
        paymentCode: "PAY123",
        customerName: "John Doe",
        sourceOfFunds: "CASH",
        narration: "Bill payment",
        depositorName: "John Doe",
        location: "Lagos",
        currencyCode: "NGN"
    };

    try {
        // First validate customer
        const validationResponse = await axios.post(`${baseURL}/validateCustomer`, paymentData);
        console.log('Validation Response:', validationResponse.data);

        if (validationResponse.data.responseCode === "90000") {
            // Then make payment
            const paymentResponse = await axios.post(`${baseURL}/payment`, paymentData);
            console.log('Payment Response:', paymentResponse.data);
        }
    } catch (error) {
        console.error('Payment failed:', error.response?.data || error.message);
    }
};

// 7. account balance
const accountBalance = async () => {
    try {
        const response = await axios.get(`${baseURL}/accountBalance`);
        console.log('Account Balance:', response.data);
    } catch (error) {
        console.error('Failed to get account balance:', error.response?.data || error.message);
    }
};

// Execute the flow
const main = async () => {
    try {
        // 1. Register client
        console.log('Step 1: Client Registration');
        await registerClient();
        
        // 2. Perform key exchange
        //console.log('\nStep 2: Key Exchange');
        //await doKeyExchange();
        
        // 3. Get categories
        //console.log('\nStep 3: Get Categories');
        //await getCategories();
        
        // Note: Replace with actual IDs from previous responses
        //const sampleCategoryId = "CATEGORY_ID";
        //const sampleBillerId = "BILLER_ID";
        
        // 4. Get billers for a category
        //console.log('\nStep 4: Get Billers');
        //await getBillersByCategory(sampleCategoryId);
        
        // 5. Get payment items
        //console.log('\nStep 5: Get Payment Items');
        //await getPaymentItems(sampleBillerId);
        
        // 6. Make payment
        ////console.log('\nStep 6: Make Payment');
        //await makePayment();

        // 7. Get account balance
        //console.log('\nStep 7: Get Account Balance');
        //await accountBalance();


        
    } catch (error) {
        console.error('Error in main flow:', error);
    }
};

// Run the main flow
main(); 