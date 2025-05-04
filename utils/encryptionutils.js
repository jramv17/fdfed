const crypto = require('crypto');

const algorithm='aes-256-cbc';
const key='jayaram-is-king-bow-down-to-king';
const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return (`${iv.toString('hex')}:${encrypted}`);
}
const decrypt = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(':');
    const origionalData = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, origionalData);
    let decryptedData = decipher.update(encrypted, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}

module.exports={encrypt,decrypt}
