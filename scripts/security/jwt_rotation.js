const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

class TokenManager {
  constructor() {
    this.secretRotationInterval = 24 * 60 * 60 * 1000; // 24h
    this.currentSecret = this.loadSecret();
    this.activeTokens = new Map();

    // Start rotation loop
    setInterval(() => this.rotateSecrets(), this.secretRotationInterval);
  }

  loadSecret() {
    // In production, load from secure vault or env
    return process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  }

  generateToken(payload, expiresIn = '1h') {
    const token = jwt.sign(payload, this.currentSecret, { expiresIn });
    // In real implementation, parse 'expiresIn' to ms
    const expiryMs = 3600000;
    this.activeTokens.set(token, Date.now() + expiryMs);
    return token;
  }

  rotateSecrets() {
    this.previousSecret = this.currentSecret;
    this.currentSecret = crypto.randomBytes(64).toString('hex');
    console.log(`[${new Date().toISOString()}] 🔄 JWT secret rotated`);

    // Optional: Persist new secret to .env or Vault
    // fs.writeFileSync('.env', `JWT_SECRET=${this.currentSecret}\n`, { flag: 'a' });
  }

  verify(token) {
    try {
      return jwt.verify(token, this.currentSecret);
    } catch (err) {
      // Try previous secret for grace period
      if (this.previousSecret) {
        try {
          return jwt.verify(token, this.previousSecret);
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  }
}

// Standalone execution if called directly
if (require.main === module) {
    const manager = new TokenManager();
    console.log('JWT Rotation Service Started');
    console.log('Initial Secret:', manager.currentSecret.substring(0, 10) + '...');
}

module.exports = TokenManager;
