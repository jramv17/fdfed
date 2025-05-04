const jsonwebtoken = require('jsonwebtoken');
require("dotenv").config();
var CryptoJS = require("crypto-js");

const PRIV_KEY = process.env.JWT_SECRET_KEY;
const AES_KEY = process.env.CRYPTO_SECRET_KEY;

function issueJWT(user) {
    const expiresIn = '1d';

    const payload = {
        sub: user,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn });
    const encryptedToken = CryptoJS.AES.encrypt(JSON.stringify(signedToken), AES_KEY).toString();

    return {
        token: encryptedToken,
        expires: expiresIn
    }
}

function getDecryptedToken(encryptedToken) {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, AES_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

module.exports = { issueJWT, getDecryptedToken };
