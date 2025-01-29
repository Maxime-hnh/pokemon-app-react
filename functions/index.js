import * as functions from 'firebase-functions';
import qs from 'qs';

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const APP_ID = process.env.EBAY_APP_ID;
const CERT_ID = process.env.EBAY_CERT_ID;

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


export const searchEbayItems = functions.https.onRequest(async (req, res) => {
  try {
    res.set("Access-Control-Allow-Origin", "*");  // Autorise toutes les origines (*)
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // ✅ Vérifier si la requête est une pré-vérification OPTIONS (Preflight request)
    if (req.method === "OPTIONS") {
      return res.status(204).send(""); // Répond immédiatement aux requêtes pré-vérification
    }

    // Étape 1 : Obtenir un token d'application
    const tokenResponse = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${APP_ID}:${CERT_ID}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "https://api.ebay.com/oauth/api_scope",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Erreur lors de l'obtention du token : ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // Étape 2 : Rechercher des items via l'API eBay
    const query = req.query.q || "pokemon booster";
    const searchResponse = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`Erreur lors de la recherche des items : ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();

    res.status(200).send(searchData);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).send({ error: error.message });
  }
});
