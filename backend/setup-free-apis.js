#!/usr/bin/env node

/**
 * Quick Setup Script for FREE API Keys
 * Run: node setup-free-apis.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🆓 SIH 2025 - FREE API Setup Guide');
console.log('=====================================\n');

console.log('Let\'s set up your FREE API keys for enhanced functionality!\n');

async function setupHuggingFace() {
  console.log('📚 HUGGING FACE SETUP (FREE - 30,000 requests/month)');
  console.log('1. Go to: https://huggingface.co/');
  console.log('2. Sign up for a FREE account');
  console.log('3. Go to Settings > Access Tokens');
  console.log('4. Click "New token" and select "Read" access');
  console.log('5. Copy the token that starts with "hf_"\n');

  return new Promise((resolve) => {
    rl.question('Enter your Hugging Face token (or press Enter to skip): ', (token) => {
      if (token.trim() && token.startsWith('hf_')) {
        console.log('✅ Valid Hugging Face token detected!\n');
        resolve(token.trim());
      } else if (token.trim()) {
        console.log('⚠️  Token should start with "hf_". Skipping for now.\n');
        resolve('your-huggingface-api-key');
      } else {
        console.log('⏭️  Skipping Hugging Face setup.\n');
        resolve('your-huggingface-api-key');
      }
    });
  });
}

async function setupOtherFreeServices() {
  console.log('🌐 OTHER FREE SERVICES (No registration needed!)');
  console.log('✅ MyMemory Translation: 5,000 requests/day (NO API KEY)');
  console.log('✅ LibreTranslate: 20 requests/minute (NO API KEY)');
  console.log('✅ Local fallback: Always works offline\n');

  return new Promise((resolve) => {
    rl.question('Would you like to enable these free services? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('✅ Free translation services will be enabled!\n');
        resolve(true);
      } else {
        console.log('⏭️  Using basic built-in translation only.\n');
        resolve(false);
      }
    });
  });
}

async function updateEnvFile(hfToken, enableFreeServices) {
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update Hugging Face token
    if (hfToken !== 'your-huggingface-api-key') {
      envContent = envContent.replace(
        /HUGGINGFACE_API_KEY=.*/,
        `HUGGINGFACE_API_KEY=${hfToken}`
      );
    }

    // Add free service URLs if enabled
    if (enableFreeServices) {
      if (!envContent.includes('MYMEMORY_API_URL')) {
        envContent += '\n# Free Translation Services\n';
        envContent += 'MYMEMORY_API_URL=https://api.mymemory.translated.net/get\n';
        envContent += 'LIBRE_TRANSLATE_URL=https://libretranslate.de/translate\n';
        envContent += 'USE_FREE_SERVICES=true\n';
      }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!\n');
    
  } catch (error) {
    console.log('⚠️  Could not update .env file automatically.');
    console.log('Please manually add these to your .env file:');
    if (hfToken !== 'your-huggingface-api-key') {
      console.log(`HUGGINGFACE_API_KEY=${hfToken}`);
    }
    if (enableFreeServices) {
      console.log('MYMEMORY_API_URL=https://api.mymemory.translated.net/get');
      console.log('LIBRE_TRANSLATE_URL=https://libretranslate.de/translate');
      console.log('USE_FREE_SERVICES=true');
    }
    console.log('');
  }
}

async function showNextSteps() {
  console.log('🚀 NEXT STEPS:');
  console.log('1. Start your backend: npm run dev');
  console.log('2. Start your frontend: npm start');
  console.log('3. Test the multilingual chat at http://localhost:3000');
  console.log('4. Your app now has enhanced AI capabilities for FREE!\n');

  console.log('💡 FREE FEATURES ENABLED:');
  console.log('✅ Better translation quality');
  console.log('✅ Enhanced chat responses');
  console.log('✅ Multilingual understanding');
  console.log('✅ No costs or billing required');
  console.log('✅ Perfect for SIH competition\n');

  console.log('📚 USAGE LIMITS (All FREE):');
  console.log('• Hugging Face: 30,000 requests/month');
  console.log('• MyMemory: 5,000 translations/day');
  console.log('• LibreTranslate: 20 requests/minute');
  console.log('• Local fallback: Unlimited\n');

  console.log('🎯 For SIH competition, this setup gives you:');
  console.log('• Professional-grade AI responses');
  console.log('• Reliable multilingual support');
  console.log('• Zero operational costs');
  console.log('• Scalable architecture\n');
}

async function main() {
  try {
    const hfToken = await setupHuggingFace();
    const enableFreeServices = await setupOtherFreeServices();
    
    await updateEnvFile(hfToken, enableFreeServices);
    await showNextSteps();
    
    console.log('🎉 Setup complete! Your SIH 2025 project is ready with FREE AI services!');
    
  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    rl.close();
  }
}

// Run the setup
main();