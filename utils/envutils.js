require("dotenv").config();

const env_variables = {
    PORT: process.env.PORT,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    MONGO_URI: process.env.MONGO_URI,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY


}


module.exports = env_variables;