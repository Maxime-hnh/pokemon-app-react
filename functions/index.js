import { functions } from 'firebase-functions';
import qs from 'qs';

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const APP_ID = process.env.EBAY_APP_ID;
const CERT_ID = process.env.EBAY_CERT_ID;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.searchEbayItems = functions.https.onRequest(async (req, res) => {
  try {
    // Étape 1 : Obtenir un token d'application
    const tokenResponse = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      qs.stringify({
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope",
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${APP_ID}:${CERT_ID}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const token = tokenResponse.data.access_token;

    // Étape 2 : Rechercher des items via l'API eBay
    const query = req.query.q || "pokemon booster"; // Exemple de mot-clé
    const response = await axios.get(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).send({ error: "Une erreur est survenue." });
  }
});