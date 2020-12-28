# PS5Bot

1. Refreshes sites until a PS5 becomes available
2. If PS5 becomes available it sends an sms and attempts to purchase

# Requirements

This project requires some environment variables. It uses Vonage to send texts of attempted purchases so an Vonage account and API secret and key is needed.
Create a `.env` file in the root of this project with the following environment variables:

```env
FIRST_NAME
LAST_NAME
EMAIL
PHONE_NUMBER
ADDRESS_LINE_1
TOWN
POSTCODE
CARD_NUMBER
CARD_NAME
CARD_EXPIRY
CARD_CVV
AMAZON_PWD
VONAGE_API_SECRET
VONAGE_API_KEY
```

# Installation

```
npm install
```

# Run

```
npm start
```