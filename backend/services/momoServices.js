const axios = require("axios");

exports.requestPayment = async ({ phone, amount, reference }) => {
  // Example placeholder – replace with real MTN/Airtel API
  return {
    status: "PENDING",
    transactionId: "TXN_" + Date.now(),
  };
};

exports.verifyPayment = async (transactionId) => {
  // Simulated success response
  return {
    status: "SUCCESS",
  };
};
