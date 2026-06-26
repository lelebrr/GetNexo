const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

const TEMPLATE_DIR = path.join(__dirname, 'templates');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.error('FATAL: ENCRYPTION_KEY environment variable is not set.');
  process.exit(1);
}

function getHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex').substr(0, 16);
}

function encrypt(text) {
    // Simple mock encryption for the config file or real AES if key length is correct
    // For stability if key is not set correctly, use a simple base64 or safe fallback
    try {
        // Ensure key is 32 bytes
        const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (e) {
        return Buffer.from(text).toString('base64'); // Fallback
    }
}

async function generatePluginZip(platform, domain, phone) {
    const variantDir = path.join(TEMPLATE_DIR, platform);

    // Check if platform exists
    if (!fs.existsSync(variantDir)) {
        throw new Error(`Platform template '${platform}' not found.`);
    }

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    const uniqueId = getHash(domain + Date.now());
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const expiryStr = expiryDate.toISOString().split('T')[0];

    // Stream transformation not easily supported on 'directory' append, 
    // so we iterate files and append sanitized content.

    // Create a virtual README
    archive.append(
        `Nexo Plugin for ${platform}\nDomain: ${domain}\nExpiry: ${expiryStr}\n\nInstructions:\n1. Upload these files to your ${platform} store.\n2. Add the script to your footer.`,
        { name: 'README.txt' }
    );

    const files = fs.readdirSync(variantDir);

    for (const file of files) {
        const filePath = path.join(variantDir, file);
        if (fs.statSync(filePath).isFile()) {
            let content = fs.readFileSync(filePath, 'utf8');

            // Replacements
            content = content.replace(/{{ID}}/g, uniqueId);
            content = content.replace(/{{DOMAIN}}/g, domain);
            content = content.replace(/{{EXPIRY}}/g, expiryStr);
            content = content.replace(/{{PHONE}}/g, phone || '');

            // Encrypt if it's a config file
            if (file.includes('config')) {
                content = encrypt(content);
            }

            archive.append(content, { name: file });
        }
    }

    archive.finalize();
    return archive;
}

module.exports = { generatePluginZip };
