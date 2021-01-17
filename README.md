# PS5Bot

A tool to purchase a PS5 when available at certain sites. This was made for educational purposes and to purchase a single PS5 for myself.


Currently checks the following product pages:
- [Amazon](https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/)
- [Game](https://www.game.co.uk/en/m/playstation-5-additional-dualsense-wireless-controller-2835866)
- [Smyths](https://www.smythstoys.com/uk/en-gb/video-games-and-tablets/playstation-5/playstation-5-consoles/playstation-5-console/p/191259)
- [Currys](https://www.currys.co.uk/gbuk/gaming/console-gaming/consoles/sony-playstation-5-825-gb-10203370-pdt.html)


## Requirements
Requires Node, an AWS account (for text message alerts) and some environment variables.

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

AMAZON_EMAIL
AMAZON_PWD

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
SMS_NUMBER
```

# Installation

```
npm install
```

# Run

```
npm start
```