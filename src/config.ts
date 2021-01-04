import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  personalDetails: PersonalDetails;
  deliveryAddress: DeliveryAddress;
  cardDetails: CardDetails;
  amazonCredentials: AmazonCredentials;
  smsConfig: SMSConfig;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export interface DeliveryAddress {
  lineOne: string;
  town: string;
  postcode: string;
}

export interface AmazonCredentials {
  username: string;
  password: string
}

export interface SMSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  smsNumber: string;
}

export default {
  personalDetails: {
    firstName: envOrThrow('FIRST_NAME'),
    lastName: envOrThrow('LAST_NAME'),
    email: envOrThrow('EMAIL'),
    phoneNumber: envOrThrow('PHONE_NUMBER'),
  },
  deliveryAddress: {
    lineOne: envOrThrow('ADDRESS_LINE_1'),
    town: envOrThrow('TOWN'),
    postcode: envOrThrow('POSTCODE'),
  },
  cardDetails: {
    number: envOrThrow('CARD_NUMBER'),
    name: envOrThrow('CARD_NAME'),
    expiry: envOrThrow('CARD_EXPIRY'),
    cvv: envOrThrow('CARD_CVV'),
  },
  amazonCredentials: {
    username: envOrThrow('AMAZON_EMAIL'),
    password: envOrThrow('AMAZON_PASSWORD'),
  },
  smsConfig: {
    accessKeyId: envOrThrow('AWS_ACCESS_KEY_ID'),
    secretAccessKey: envOrThrow('AWS_SECRET_ACCESS_KEY'),
    region: envOrThrow('AWS_REGION'),
    smsNumber: envOrThrow('SMS_NUMBER'),
  }
} as Config;

function envOrThrow(key: string) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return process.env[key];
}
