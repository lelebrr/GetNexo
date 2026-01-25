#!/usr/bin/env node

// Script para testar todas as APIs de imagem do sistema
const axios = require('axios');
require('dotenv').config();

console.log('🧪 Testando APIs de imagem do sistema GetNexo...\n');

// Configurações
const testPrompt = 'Foto realista de tênis branco, fundo branco, estúdio profissional';

// Função para testar API
async function testAPI(name, url, data, headers = {}) {
    try {
        console.log(`🔄 Testando ${name}...`);
        const response = await axios.post(url, data, {
            headers: { 'Content-Type': 'application/json', ...headers },
            timeout: 30000
        });

        if (response.status === 200) {
            console.log(`✅ ${name}: Sucesso!`);
            if (response.data.url) {
                console.log(`   📸 URL da imagem: ${response.data.url.substring(0, 80)}...`);
            } else if (response.data.images && response.data.images[0]) {
                console.log(`   📸 URL da imagem: ${response.data.images[0].url.substring(0, 80)}...`);
            } else {
                console.log(`   📸 Resposta: ${JSON.stringify(response.data).substring(0, 100)}...`);
            }
            return true;
        } else {
            console.log(`❌ ${name}: Status ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${name}: Erro - ${error.message}`);
        if (error.response) {
            console.log(`   Detalhes: ${error.response.status} - ${error.response.data}`);
        }
        return false;
    }
}

// Testar Puter.js
console.log('=== Testando Puter.js ===');
const puterTest = testAPI(
    'Puter.js',
    'https://api.puter.com/ai/image',
    {
        prompt: testPrompt,
        model: 'flux'
    }
);

// Testar Pixazo AI
console.log('\n=== Testando Pixazo AI ===');
const pixazoTest = testAPI(
    'Pixazo AI',
    'https://api.pixazo.ai/v1/images/generations',
    {
        prompt: testPrompt,
        model: 'flux-schnell'
    }
);

// Testar Hugging Face
console.log('\n=== Testando Hugging Face ===');
const hfTest = testAPI(
    'Hugging Face',
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
    {
        inputs: testPrompt
    },
    {
        'Authorization': `Bearer ${process.env.HF_KEY}`
    }
);

// Aguardar todos os testes
Promise.all([puterTest, pixazoTest, hfTest]).then(results => {
    console.log('\n📊 Resultados dos testes:');
    console.log(`   Puter.js: ${results[0] ? '✅' : '❌'}`);
    console.log(`   Pixazo AI: ${results[1] ? '✅' : '❌'}`);
    console.log(`   Hugging Face: ${results[2] ? '✅' : '❌'}`);

    const successCount = results.filter(r => r).length;
    console.log(`\n🎯 Total: ${successCount}/3 APIs funcionando`);

    if (successCount === 0) {
        console.log('⚠️  Nenhuma API funcionando! Verifique suas chaves e conexão.');
    } else if (successCount === 3) {
        console.log('🎉 Todas as APIs funcionando perfeitamente!');
    } else {
        console.log('✅ Algumas APIs funcionando. O sistema vai usar fallback.');
    }

    console.log('\n💡 Dica: O bot automaticamente tenta as APIs nesta ordem:');
    console.log('   1. Puter.js (principal)');
    console.log('   2. Pixazo AI (fallback)');
    console.log('   3. Hugging Face (último recurso)');
});