// scripts/checkSitemap.js

const https = require('https');

const SITEMAP_INDEX_URL = 'https://api.thehumantechblog.com/sitemap.xml.gz';

/**
 * Fetch a remote URL (supports gzip) and return buffer.
 */
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          } else {
            resolve(Buffer.concat(chunks));
          }
        });
      })
      .on('error', reject);
  });
}

/**
 * Gzip decode using built-in zlib
 */
const zlib = require('zlib');
function gunzipBuffer(buffer) {
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded.toString('utf-8'));
    });
  });
}

/**
 * Extract <loc> URLs from XML using regex (not 100% XML safe but works for sitemaps)
 */
function extractLocs(xml) {
  const locs = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    locs.push(match[1]);
  }
  return locs;
}

async function checkSitemap() {
  try {
    console.log(`🔍 Checking sitemap index: ${SITEMAP_INDEX_URL}\n`);

    const gzipped = await fetchBuffer(SITEMAP_INDEX_URL);
    const xml = await gunzipBuffer(gzipped);

    const sitemapUrls = extractLocs(xml);

    if (!sitemapUrls.length) {
      console.error('❌ No <loc> found in sitemap index');
      return;
    }

    console.log(`✅ Found ${sitemapUrls.length} sitemap(s):\n`);

    for (const sitemapUrl of sitemapUrls) {
      console.log(`📂 Reading sitemap: ${sitemapUrl}`);

      const sitemapText = await fetchBuffer(sitemapUrl);
      const sitemapXml = sitemapText.toString('utf-8');
      const urls = extractLocs(sitemapXml);

      console.log(` → ${urls.length} URLs found\n`);

      for (const url of urls) {
        await new Promise((resolve) => {
          https
            .get(url, (res) => {
              if (res.statusCode !== 200) {
                console.error(`❌ ${url} → HTTP ${res.statusCode}`);
              }
              resolve();
            })
            .on('error', () => {
              console.error(`❌ Failed to reach ${url}`);
              resolve();
            });
        });
      }
    }

    console.log('\n✅ Sitemap check complete.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkSitemap();
