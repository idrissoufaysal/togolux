import { createClient, createAdminClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://45vkpisw.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

// Browser or standard client
export const insforge = createClient({
  baseUrl,
  anonKey,
});

// Getter for server-side admin client (using service key)
export function getInsforgeAdmin() {
  const serviceKey = process.env.INSFORGE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('INSFORGE_SERVICE_KEY is not defined in the server environment.');
  }
  return createAdminClient({
    baseUrl,
    apiKey: serviceKey,
  });
}
