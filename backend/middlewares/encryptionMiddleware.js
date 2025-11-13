const crypto = require('crypto');

const secretKeyHex = process.env.ENCRYPT_SECRET; // Load from environment variable
const ivHex = process.env.IV_SECRET; // Load from environment variable

const secretKey = Buffer.from(secretKeyHex, 'hex');
const iv = Buffer.from(ivHex, 'hex');

// Encryption function
function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
    return {
        data: encrypted.toString('hex'),
        tag: cipher.getAuthTag().toString('hex')
    };
}

// Decryption function
// function decryptData(data) {
//     const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, iv);
//     decipher.setAuthTag(Buffer.from(data.tag, 'hex'));
//     const decrypted = Buffer.concat([decipher.update(Buffer.from(data.data, 'hex')), decipher.final()]);
//     return decrypted.toString('utf8');
// }

// Decryption function
function decryptData(data) {
    const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, iv);
    decipher.setAuthTag(Buffer.from(data.tag, 'hex'));

    const decryptedChunks = [];
    decryptedChunks.push(decipher.update(Buffer.from(data.data, 'hex')));
    decryptedChunks.push(decipher.final());

    return Buffer.concat(decryptedChunks).toString('utf8');
}


// Middleware function to encrypt data before sending
function encryptMiddleware(req, res, next) {
    const originalSend = res.send;
    res.send = (data) => {
        const encryptedData = encryptData(data);
        originalSend.call(res, encryptedData);
    };
    next();
}

// Middleware function to decrypt data before processing
function decryptMiddleware(req, res, next) {
    if (req.body && req.body.data && req.params) {
        const decryptedData = decryptData(req.body.data);
        req.body = JSON.parse(decryptedData);
    }
    next();
}

module.exports = {
    encryptMiddleware,
    decryptMiddleware
};
