import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.BREVO_API_KEY;

SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;

export const brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();

export const sender = {
  email: "varshith2110@gmail.com", 
  name: "Authentication System",
};


