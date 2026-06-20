#!/usr/bin/env node
/**
 * Test script to verify Watchmode API and Firebase configuration
 * Run with: node test-api.js
 */

require('dotenv').config();
const axios = require('axios');

const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY_1;
const WATCHMODE_API_KEY_2 = process.env.WATCHMODE_API_KEY_2;
const BASE_URL = 'https://api.watchmode.com/v1';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};

async function testWatchmodeAPI() {
  console.log('\n========================================');
  console.log('🧪 WATCHMODE API TEST');
  console.log('========================================\n');

  console.log(`📍 API Key (primary): ${WATCHMODE_API_KEY ? WATCHMODE_API_KEY.substring(0, 20) + '...' : 'NOT SET'}`);
  console.log(`📍 API Key (fallback): ${WATCHMODE_API_KEY_2 ? WATCHMODE_API_KEY_2.substring(0, 20) + '...' : 'NOT SET'}\n`);

  if (!WATCHMODE_API_KEY) {
    console.error('❌ WATCHMODE_API_KEY_1 is not set in .env file\n');
    return false;
  }

  try {
    console.log('📝 Searching for "Captain Tsubasa"...\n');

    const searchUrl = `${BASE_URL}/search/?search_field=name&search_value=Captain%20Tsubasa&types=movie,tv_series&apiKey=${WATCHMODE_API_KEY}`;
    
    const response = await axios.get(searchUrl, { timeout: 15000 });

    console.log('✅ Search successful!\n');

    const results = response.data.title_results || [];
    console.log(`📊 Found ${results.length} titles\n`);

    if (results.length > 0) {
      console.log('📺 Top results:');
      results.slice(0, 3).forEach((title, i) => {
        console.log(
          `   ${i + 1}. "${title.name}" (ID: ${title.id}, Type: ${title.type}, Year: ${title.year})`
        );
      });

      // Get details for first result
      const firstTitle = results[0];
      console.log(`\n📋 Fetching details for "${firstTitle.name}"...\n`);

      const detailsUrl = `${BASE_URL}/title/${firstTitle.id}/details/?apiKey=${WATCHMODE_API_KEY}`;
      const detailsResponse = await axios.get(detailsUrl, { timeout: 15000 });
      const details = detailsResponse.data;

      console.log(`   Title: ${details.title}`);
      console.log(`   Year: ${details.release_year}`);
      console.log(`   Genre: ${details.genre_names?.join(', ') || 'N/A'}`);
      console.log(`   Plot: ${(details.plot_overview || 'N/A').substring(0, 120)}...\n`);

      // Get streaming sources
      console.log(`🎬 Fetching streaming sources for Portugal (PT)...\n`);
      const sourcesUrl = `${BASE_URL}/title/${firstTitle.id}/sources/?region=PT&apiKey=${WATCHMODE_API_KEY}`;
      const sourcesResponse = await axios.get(sourcesUrl, { timeout: 15000 });

      const sources = sourcesResponse.data.results || [];
      if (sources.length > 0) {
        console.log(`   Found ${sources.length} streaming options:`);
        sources.slice(0, 5).forEach((source, i) => {
          console.log(`   ${i + 1}. ${source.source_name} (${source.type})`);
        });
      } else {
        console.log('   ℹ️  No streaming sources currently available for this region');
      }
    }

    console.log('\n✅ Watchmode API is working!\n');
    return true;
  } catch (error) {
    console.error('❌ Watchmode API test failed\n');
    if (axios.isAxiosError(error)) {
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   Error: ${error.response?.data?.error || error.message}`);
    } else if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
    }
    console.log();
    return false;
  }
}

function testFirebaseConfig() {
  console.log('========================================');
  console.log('🔥 FIREBASE CONFIGURATION TEST');
  console.log('========================================\n');

  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  let allSet = true;

  console.log('Firebase Config Status:\n');
  requiredFields.forEach((field) => {
    const value = firebaseConfig[field];
    const status = value ? '✅' : '❌';
    console.log(`   ${status} ${field}: ${value ? value.substring(0, 25) + '...' : 'NOT SET'}`);
    if (!value) allSet = false;
  });

  console.log();

  if (allSet) {
    console.log('✅ Firebase configuration is complete!\n');
    console.log('✨ Ready to implement:');
    console.log('   • User authentication (sign up, sign in, sign out)');
    console.log('   • Firestore database operations');
    console.log('   • User profiles and watch lists\n');
    return true;
  } else {
    console.error('❌ Firebase configuration is incomplete\n');
    console.error('Missing fields need to be added to .env file\n');
    return false;
  }
}

async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  CineFind API & Firebase Test Suite   ║');
  console.log('╚════════════════════════════════════════╝');

  const watchmodeOk = await testWatchmodeAPI();
  const firebaseOk = testFirebaseConfig();

  console.log('════════════════════════════════════════');
  console.log('📊 SUMMARY\n');

  if (watchmodeOk && firebaseOk) {
    console.log('✅ All tests passed! Your setup is complete.\n');
    console.log('🚀 Next steps:');
    console.log('   1. npm start  — Launch the Expo dev server');
    console.log('   2. Build out screens in src/screens/');
    console.log('   3. Create UI components in src/components/');
    console.log('   4. Implement database operations in src/services/db.ts\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
}

runAllTests().catch(console.error);
