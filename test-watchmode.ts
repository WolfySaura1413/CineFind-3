/**
 * Test script to verify Watchmode API connectivity
 * Run with: npx ts-node test-watchmode.ts
 */

import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const WATCHMODE_API_KEY_1 = process.env.WATCHMODE_API_KEY_1 || 'wm_NIPxuym3KKU7ZbRZhe1NzFdjRKdrtJAKlB5cPzXPRo8';
const WATCHMODE_API_KEY_2 = process.env.WATCHMODE_API_KEY_2 || '';
const BASE_URL = 'https://api.watchmode.com/v1';

async function testWatchmodeAPI() {
  console.log('🧪 Testing Watchmode API...\n');
  console.log(`📍 API Key 1 (primary): ${WATCHMODE_API_KEY_1.substring(0, 15)}...`);
  console.log(`📍 API Key 2 (fallback): ${WATCHMODE_API_KEY_2 ? WATCHMODE_API_KEY_2.substring(0, 15) + '...' : 'NOT SET'}\n`);

  try {
    // Test 1: Search for "Captain Tsubasa"
    console.log('📝 Test 1: Searching for "Captain Tsubasa"...');
    const searchQuery = 'Captain Tsubasa';
    const searchUrl = `${BASE_URL}/search/?search_field=name&search_value=${encodeURIComponent(searchQuery)}&types=movie,tv_series&apiKey=${WATCHMODE_API_KEY_1}`;

    console.log(`   URL: ${searchUrl.substring(0, 100)}...\n`);

    const searchResponse = await axios.get(searchUrl, {
      timeout: 10000,
    });

    console.log('✅ Search successful!\n');
    console.log(`📊 Results: ${searchResponse.data.title_results?.length || 0} titles found\n`);

    if (searchResponse.data.title_results && searchResponse.data.title_results.length > 0) {
      console.log('📺 Top results:');
      searchResponse.data.title_results.slice(0, 3).forEach((title, index) => {
        console.log(`   ${index + 1}. ${title.name} (ID: ${title.id}, Type: ${title.type}, Year: ${title.year})`);
      });
    } else {
      console.log('⚠️  No results found');
    }

    console.log('\n---\n');

    // Test 2: Get details for the first result (if found)
    if (searchResponse.data.title_results && searchResponse.data.title_results.length > 0) {
      const firstTitle = searchResponse.data.title_results[0];
      console.log(`📋 Test 2: Getting details for "${firstTitle.name}" (ID: ${firstTitle.id})...`);

      const detailsUrl = `${BASE_URL}/title/${firstTitle.id}/details/?apiKey=${WATCHMODE_API_KEY_1}`;
      const detailsResponse = await axios.get(detailsUrl, {
        timeout: 10000,
      });

      console.log('✅ Details retrieved successfully!\n');
      console.log(`   Title: ${detailsResponse.data.title}`);
      console.log(`   Year: ${detailsResponse.data.release_year}`);
      console.log(`   Genre: ${detailsResponse.data.genre_names?.join(', ') || 'N/A'}`);
      console.log(`   Synopsis: ${(detailsResponse.data.plot_overview || 'N/A').substring(0, 100)}...`);

      console.log('\n---\n');

      // Test 3: Get streaming sources
      console.log(`🎬 Test 3: Getting streaming sources for "${firstTitle.name}"...`);
      const sourcesUrl = `${BASE_URL}/title/${firstTitle.id}/sources/?region=PT&apiKey=${WATCHMODE_API_KEY_1}`;
      const sourcesResponse = await axios.get(sourcesUrl, {
        timeout: 10000,
      });

      console.log('✅ Sources retrieved successfully!\n');

      if (sourcesResponse.data.results && sourcesResponse.data.results.length > 0) {
        console.log(`   Found ${sourcesResponse.data.results.length} streaming options:`);
        sourcesResponse.data.results.slice(0, 3).forEach((source, index) => {
          console.log(`   ${index + 1}. ${source.source_name} (Type: ${source.type})`);
        });
      } else {
        console.log('   No streaming sources available for this region (PT)');
      }
    }

    console.log('\n✅ All tests passed! Watchmode API is working correctly.\n');
  } catch (error) {
    console.error('\n❌ Test failed!\n');

    if (axios.isAxiosError(error)) {
      console.error(`Status: ${error.response?.status}`);
      console.error(`Message: ${error.response?.data?.error || error.message}`);

      if (error.response?.status === 429) {
        console.error('\n⚠️  Rate limit hit! Trying with fallback key...');
        if (WATCHMODE_API_KEY_2) {
          // Retry with fallback key
          try {
            const fallbackUrl = `${BASE_URL}/search/?search_field=name&search_value=${encodeURIComponent('Captain Tsubasa')}&types=movie,tv_series&apiKey=${WATCHMODE_API_KEY_2}`;
            const fallbackResponse = await axios.get(fallbackUrl, { timeout: 10000 });
            console.log('✅ Fallback key worked!');
            console.log(`Results: ${fallbackResponse.data.title_results?.length || 0} titles found`);
          } catch (fallbackError) {
            console.error('❌ Fallback key also failed');
          }
        } else {
          console.error('❌ No fallback key configured');
        }
      }
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Run the test
testWatchmodeAPI();
