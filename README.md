# PS5Bot

A tool to purchase a PS5 when available at certain sites. This was made for educational purposes and to purchase a single PS5 for myself.


Currently checks the following product pages:
- [Amazon](https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/)
- [Game](https://www.game.co.uk/en/m/playstation-5-additional-dualsense-wireless-controller-2835866)


## Requirements
Requires Node, a Vonage Account and some environment variables.

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
AMAZON_EMAIL

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