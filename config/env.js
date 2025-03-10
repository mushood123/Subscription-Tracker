import { config } from 'dotenv';

const PATH = `.env.${process.env.NODE_ENV || 'development'}.local`;

/* eslint-disable-next-line */
console.log("PATH", PATH);

config({ path: PATH });


export const {

  PORT,
  NODE_ENV,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  QSTASH_URL,
  QSTASH_TOKEN,
  SERVER_URL,
  EMAIL_PASSWORD,
  EMAIL_USERNAME,

} = process.env;
