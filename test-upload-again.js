import { createClient } from '@insforge/sdk';
import fs from 'fs';

// Read .env manually
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  console.log("Could not read .env file.");
}

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://45vkpisw.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

const insforge = createClient({
  baseUrl,
  anonKey,
});

async function run() {
  try {
    console.log("Testing file upload to 'property-images' using anonKey...");
    const testFileName = `test-post-grant-${Date.now()}.txt`;
    const blob = new Blob(['Hello InsForge Storage!'], { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from('property-images')
      .upload(testFileName, blob);
      
    if (uploadError) {
      console.error("Upload failed:", uploadError);
    } else {
      console.log("Upload successful! Public URL:", uploadData.url);
      
      console.log("Cleaning up: Deleting uploaded file...");
      const { data: deleteData, error: deleteError } = await insforge.storage
        .from('property-images')
        .remove(testFileName);
        
      if (deleteError) {
        console.error("Delete failed:", deleteError);
      } else {
        console.log("Delete successful:", deleteData.message);
      }
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

run();
