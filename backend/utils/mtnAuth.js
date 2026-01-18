const axios = require("axios");

const getMomoAccessToken = async () => {
  const response = await axios.post(
    `${process.env.MTN_BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MTN_COLLECTION_PRIMARY_KEY,
        "Authorization":
          "Basic " +
          Buffer.from(
            `${process.env.MTN_COLLECTION_PRIMARY_KEY}:${process.env.MTN_COLLECTION_SECONDARY_KEY}`
          ).toString("base64")
      }
    }
  );

  return response.data.access_token;
};

module.exports = getMomoAccessToken;
