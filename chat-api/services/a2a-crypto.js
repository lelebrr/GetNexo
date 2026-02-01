/**
 * A2A Cryptographic Service
 * 
 * Provides cryptographic operations for A2A protocol:
 * - RSA key pair generation for agent identities
 * - JWS signing of Agent Cards
 * - Signature verification for incoming messages
 * - VDC (Verifiable Digital Credential) validation for AP2 mandates
 */

const crypto = require('crypto');

// Key generation options
const KEY_OPTIONS = {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
};

/**
 * Generate a new RSA key pair for agent identity
 * @returns {Object} { publicKey, privateKey }
 */
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', KEY_OPTIONS);
    return { publicKey, privateKey };
}

/**
 * Sign data using the private key (JWS-like signature)
 * @param {string|Object} payload - Data to sign
 * @param {string} privateKey - PEM-encoded private key
 * @returns {Object} { payload, signature, algorithm }
 */
function signPayload(payload, privateKey) {
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const payloadB64 = Buffer.from(payloadStr).toString('base64url');

    const sign = crypto.createSign('SHA256');
    sign.update(payloadB64);
    sign.end();

    const signature = sign.sign(privateKey, 'base64url');

    return {
        payload: payloadB64,
        signature: signature,
        algorithm: 'RS256',
        created: new Date().toISOString()
    };
}

/**
 * Verify a signed payload using the public key
 * @param {Object} signedData - { payload, signature }
 * @param {string} publicKey - PEM-encoded public key
 * @returns {Object} { valid, payload, error }
 */
function verifySignature(signedData, publicKey) {
    try {
        const { payload, signature } = signedData;

        const verify = crypto.createVerify('SHA256');
        verify.update(payload);
        verify.end();

        const isValid = verify.verify(publicKey, signature, 'base64url');

        if (isValid) {
            const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8');
            let parsedPayload;
            try {
                parsedPayload = JSON.parse(decodedPayload);
            } catch {
                parsedPayload = decodedPayload;
            }
            return { valid: true, payload: parsedPayload, error: null };
        }

        return { valid: false, payload: null, error: 'Invalid signature' };
    } catch (error) {
        return { valid: false, payload: null, error: error.message };
    }
}

/**
 * Create a signed Agent Card (JWS envelope)
 * @param {Object} agentCard - The agent card data
 * @param {string} privateKey - PEM private key for signing
 * @param {string} keyId - Identifier for the signing key
 * @returns {Object} Signed agent card envelope
 */
function signAgentCard(agentCard, privateKey, keyId) {
    const header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: keyId
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(agentCard)).toString('base64url');

    const signatureInput = `${headerB64}.${payloadB64}`;

    const sign = crypto.createSign('SHA256');
    sign.update(signatureInput);
    sign.end();

    const signature = sign.sign(privateKey, 'base64url');

    return {
        header: headerB64,
        payload: payloadB64,
        signature: signature,
        compact: `${headerB64}.${payloadB64}.${signature}`
    };
}

/**
 * Verify a signed Agent Card
 * @param {string} compactJws - The compact JWS string
 * @param {string} publicKey - PEM public key for verification
 * @returns {Object} { valid, agentCard, error }
 */
function verifyAgentCard(compactJws, publicKey) {
    try {
        const parts = compactJws.split('.');
        if (parts.length !== 3) {
            return { valid: false, agentCard: null, error: 'Invalid JWS format' };
        }

        const [headerB64, payloadB64, signature] = parts;
        const signatureInput = `${headerB64}.${payloadB64}`;

        const verify = crypto.createVerify('SHA256');
        verify.update(signatureInput);
        verify.end();

        const isValid = verify.verify(publicKey, signature, 'base64url');

        if (isValid) {
            const agentCard = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
            return { valid: true, agentCard, error: null };
        }

        return { valid: false, agentCard: null, error: 'Invalid signature' };
    } catch (error) {
        return { valid: false, agentCard: null, error: error.message };
    }
}

/**
 * VDC (Verifiable Digital Credential) Operations for AP2
 */

/**
 * Create a VDC signature for a mandate
 * @param {Object} mandate - The mandate data
 * @param {string} privateKey - User's private key
 * @returns {Object} Signed mandate with VDC envelope
 */
function signMandate(mandate, privateKey) {
    const vdc = {
        type: 'AP2-Mandate',
        version: '1.0',
        issuer: mandate.user_id || 'user',
        issued_at: new Date().toISOString(),
        mandate_id: mandate.mandate_id,
        constraints: mandate.constraints,
        scope: mandate.scope
    };

    const signed = signPayload(vdc, privateKey);

    return {
        ...mandate,
        vdc: signed
    };
}

/**
 * Verify a VDC-signed mandate
 * @param {Object} signedMandate - Mandate with VDC envelope
 * @param {string} publicKey - User's public key
 * @returns {Object} { valid, mandate, error }
 */
function verifyMandate(signedMandate, publicKey) {
    if (!signedMandate.vdc) {
        return { valid: false, mandate: null, error: 'No VDC signature found' };
    }

    const result = verifySignature(signedMandate.vdc, publicKey);

    if (result.valid) {
        return { valid: true, mandate: result.payload, error: null };
    }

    return result;
}

/**
 * Validate mandate constraints
 * @param {Object} mandate - The mandate with constraints
 * @param {Object} transaction - The proposed transaction
 * @returns {Object} { valid, violations }
 */
function validateMandateConstraints(mandate, transaction) {
    const violations = [];
    const constraints = mandate.constraints || {};

    // Check max amount
    if (constraints.max_amount !== undefined) {
        if (transaction.amount > constraints.max_amount) {
            violations.push({
                type: 'max_amount_exceeded',
                constraint: constraints.max_amount,
                actual: transaction.amount
            });
        }
    }

    // Check min amount
    if (constraints.min_amount !== undefined) {
        if (transaction.amount < constraints.min_amount) {
            violations.push({
                type: 'min_amount_below',
                constraint: constraints.min_amount,
                actual: transaction.amount
            });
        }
    }

    // Check currency
    if (constraints.currency) {
        if (transaction.currency !== constraints.currency) {
            violations.push({
                type: 'currency_mismatch',
                constraint: constraints.currency,
                actual: transaction.currency
            });
        }
    }

    // Check expiration
    if (constraints.expires_at) {
        const expiresAt = new Date(constraints.expires_at);
        if (new Date() > expiresAt) {
            violations.push({
                type: 'mandate_expired',
                constraint: constraints.expires_at,
                actual: new Date().toISOString()
            });
        }
    }

    // Check merchant restriction
    if (constraints.merchants && Array.isArray(constraints.merchants)) {
        if (!constraints.merchants.includes(transaction.merchant_id)) {
            violations.push({
                type: 'merchant_not_allowed',
                constraint: constraints.merchants,
                actual: transaction.merchant_id
            });
        }
    }

    // Check category restriction
    if (constraints.categories && Array.isArray(constraints.categories)) {
        if (!constraints.categories.includes(transaction.category)) {
            violations.push({
                type: 'category_not_allowed',
                constraint: constraints.categories,
                actual: transaction.category
            });
        }
    }

    // Check max transactions
    if (constraints.max_transactions !== undefined) {
        if (mandate.transaction_count >= constraints.max_transactions) {
            violations.push({
                type: 'max_transactions_reached',
                constraint: constraints.max_transactions,
                actual: mandate.transaction_count
            });
        }
    }

    return {
        valid: violations.length === 0,
        violations
    };
}

/**
 * Generate a random transaction ID
 * @returns {string} Transaction ID
 */
function generateTransactionId() {
    return `txn_${crypto.randomBytes(16).toString('hex')}`;
}

/**
 * Generate a random mandate ID
 * @returns {string} Mandate ID
 */
function generateMandateId() {
    return `mdt_${crypto.randomBytes(12).toString('hex')}`;
}

/**
 * Hash data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} Hex-encoded hash
 */
function hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create HMAC signature
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {string} Hex-encoded HMAC
 */
function createHmac(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

/**
 * Verify HMAC signature
 * @param {string} data - Original data
 * @param {string} signature - HMAC to verify
 * @param {string} secret - Secret key
 * @returns {boolean} Is valid
 */
function verifyHmac(data, signature, secret) {
    const expected = createHmac(data, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

module.exports = {
    // Key management
    generateKeyPair,

    // General signing
    signPayload,
    verifySignature,

    // Agent Card (A2A)
    signAgentCard,
    verifyAgentCard,

    // Mandates (AP2/VDC)
    signMandate,
    verifyMandate,
    validateMandateConstraints,

    // Utilities
    generateTransactionId,
    generateMandateId,
    hashData,
    createHmac,
    verifyHmac
};
