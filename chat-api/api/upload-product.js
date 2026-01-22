const multer = require('multer');
const path = require('path');
const fs = require('fs');
const admZip = require('adm-zip');

// Configure storage
const uploadManager = multer({ storage: multer.memoryStorage() });
const upload = uploadManager.fields([
    { name: 'zip360', maxCount: 1 },
    { name: 'model3d', maxCount: 1 },
    { name: 'modelUsdz', maxCount: 1 }
]);

const PRODUCTS_DB = path.join(__dirname, '../data/products.json');
const UPLOAD_DIR = path.join(__dirname, '../public/products');

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

async function uploadProduct(req, res) {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        const { id, nome, preco, desc, autoRotate } = req.body;
        if (!id || !nome) return res.status(400).json({ error: "ID e Nome são obrigatórios." });

        const productPath = path.join(UPLOAD_DIR, id);
        if (!fs.existsSync(productPath)) fs.mkdirSync(productPath, { recursive: true });

        const productData = {
            id,
            nome,
            preco: parseFloat(preco),
            desc,
            autoRotate: autoRotate === 'true',
            has360: false,
            hasAR: false,
            files: {}
        };

        try {
            // Handle 360 ZIP
            if (req.files['zip360']) {
                const zipFile = req.files['zip360'][0];
                if (zipFile.size > 72 * 1024 * 1024) throw new Error("ZIP de 360 muito grande (Max 72MB total)");

                const zip = new admZip(zipFile.buffer);
                const zipEntries = zip.getEntries();

                const targetDir = path.join(productPath, '360');
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);

                zipEntries.forEach(entry => {
                    if (!entry.isDirectory && /\.(jpg|jpeg|png)$/i.test(entry.entryName)) {
                        // Ensure no subfolders in path
                        const fileName = path.basename(entry.entryName);
                        fs.writeFileSync(path.join(targetDir, fileName), entry.getData());
                    }
                });
                productData.has360 = true;
            }

            // Handle 3D GLB
            if (req.files['model3d']) {
                const glbFile = req.files['model3d'][0];
                if (glbFile.size > 10 * 1024 * 1024) throw new Error("GLB excede 10MB");
                if (!glbFile.originalname.toLowerCase().endsWith('.glb')) throw new Error("Apenas .glb permitido para 3D principal");

                const targetFile = path.join(productPath, 'model.glb');
                fs.writeFileSync(targetFile, glbFile.buffer);
                productData.hasAR = true;
                productData.files.glb = `/products/${id}/model.glb`;
            }

            // Handle USDZ
            if (req.files['modelUsdz']) {
                const usdzFile = req.files['modelUsdz'][0];
                if (usdzFile.size > 15 * 1024 * 1024) throw new Error("USDZ excede 15MB");

                const targetFile = path.join(productPath, 'model.usdz');
                fs.writeFileSync(targetFile, usdzFile.buffer);
                productData.files.usdz = `/products/${id}/model.usdz`;
            }

            // Update Database
            let products = [];
            if (fs.existsSync(PRODUCTS_DB)) {
                products = JSON.parse(fs.readFileSync(PRODUCTS_DB, 'utf-8'));
            }

            const existingIndex = products.findIndex(p => p.id === id);
            if (existingIndex > -1) {
                products[existingIndex] = { ...products[existingIndex], ...productData };
            } else {
                products.push(productData);
            }

            fs.writeFileSync(PRODUCTS_DB, JSON.stringify(products, null, 2));

            console.log(`[UPLOAD] Produto salvo: ${id} | 3D: ${productData.hasAR} | 360: ${productData.has360}`);
            res.json({ success: true, product: productData });

        } catch (e) {
            console.error("[UPLOAD ERROR]", e.message);
            res.status(400).json({ error: e.message });
        }
    });
}

module.exports = { uploadProduct };
