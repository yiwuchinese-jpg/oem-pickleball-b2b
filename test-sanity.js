/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function run() {
  try {
    const buffer = fs.readFileSync('public/pickleball.png');
    console.log("Uploading...");
    const asset = await writeClient.assets.upload('image', buffer, { filename: 'test.png' });
    console.log("Success:", asset._id);
  } catch (err) {
    console.error("Failed:", err);
  }
}
run();
