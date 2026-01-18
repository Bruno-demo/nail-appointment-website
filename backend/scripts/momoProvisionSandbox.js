// This script creates an MTN MoMo Sandbox API User + API Key,
// then prints them so you can paste into your .env.

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
// Load .env file
require("dotenv").config();


const BASE_URL = "https://sandbox.momodeveloper.mtn.com";
const callbackHost = process.env.MTN_BASE_URL || "localhost";

async function run() {
  const subscriptionKey = process.env.MTN_SUBSCRIPTION_KEY;
  if (!subscriptionKey) {
    console.log("❌ Missing MTN_SUBSCRIPTION_KEY in .env");
    process.exit(1);
  }

  const apiUser = uuidv4();

  // 1) Create API User
  await axios.post(
    `${BASE_URL}/v1_0/apiuser`,
    { providerCallbackHost: callbackHost },
    {
      headers: {
        "X-Reference-Id": apiUser,
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "application/json",
      },
    }
  );

  // 2) Create API Key
  const apiKeyRes = await axios.post(
    `${BASE_URL}/v1_0/apiuser/${apiUser}/apikey`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
    }
  );

  console.log("\n✅ MoMo Sandbox Provisioned:");
  console.log("MTN_API_USER =", apiUser);
  console.log("MTN_API_KEY  =", apiKeyRes.data.apiKey);
  console.log("\nNow paste these into your .env and restart backend.\n");
}

run().catch((err) => {
  console.error("❌ Provision failed:", err.response?.data || err.message);
});
