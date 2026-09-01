// env.js — Central environment variable loader
const dotenv = require('dotenv');
dotenv.config();

// Validate required variables

const REQUIRED = [
  'PORT',
  'OWM_API_KEY',      
  'AUTH0_DOMAIN',     
  'AUTH0_AUDIENCE',   
];


const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('[env] FATAL — missing required environment variables:');
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1); 
}

//Export named constants 
module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  OWM_API_KEY: process.env.OWM_API_KEY,
  MONGO_URI: process.env.MONGO_URI || '',          // Optional 
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Auth0 
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,    
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,  
};
