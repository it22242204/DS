// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";
require('dotenv').config(); // Make sure this is at the top

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';


// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

async function createMessage() {
  const message = await client.messages.create({
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
    from: "+19473004716",
    to: "+94751170942",
  });

  console.log(message.body);
}

createMessage();