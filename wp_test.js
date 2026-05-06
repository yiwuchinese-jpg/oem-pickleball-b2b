/* eslint-disable */
const https = require('https');

const auth = Buffer.from('894825716@qq.com:H5Ze AcJY H5Tn MMar tUzd HA6i').toString('base64');
const host = 'chineseyiwu.com';
const headers = {
  'Authorization': `Basic ${auth}`,
  'User-Agent': 'TraeBot/1.0',
  'Accept': 'application/json'
};

function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      path: `/wp-json/wp/v2${path}`,
      method: method,
      headers: headers,
      family: 4 // Force IPv4
    };
    
    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          if (responseBody) {
            resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
          } else {
            resolve({ status: res.statusCode, data: null });
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function fixPage(pageId) {
    console.log(`Fetching Page ID: ${pageId}...`);
    const res = await request(`/pages/${pageId}?context=edit`);
    if (res.status !== 200 || !res.data) {
        console.log(`Failed to fetch page ${pageId}`);
        return;
    }
    
    let content = res.data.content?.raw || res.data.content?.rendered || "";
    let changed = false;

    // --- Fix 404s ---
    if (content.includes('chineseyiwu.com/free-quote')) {
        content = content.replace(/https?:\/\/chineseyiwu\.com\/([a-z]{2}\/)?free-quote\/?/g, 'https://chineseyiwu.com/contact/');
        changed = true;
    }
    const deadBlogs = [
        'jewelry-packaging-guide', 'fragile-packing-guide', 'steel-hardness-guide',
        'smart-pet-tech-guide', 'stainless-steel-guide', 'cny-shipping-guide'
    ];
    for (const blog of deadBlogs) {
        if (content.includes(blog)) {
            const regex = new RegExp(`https?:\\/\\/chineseyiwu\\.com\\/([a-z]{2}\\/)?blog\\/${blog}\\/?`, 'g');
            content = content.replace(regex, 'https://chineseyiwu.com/$1blog/');
            changed = true;
        }
    }

    // --- Fix 301s (Trailing slashes) ---
    const redirects = [
        'services/product-sourcing', 'services/yiwu-market-agent', 'services/private-label-oem',
        'about-us', 'products/wholesale-jewelry-accessories', 'services/logistics-shipping',
        'yiwu-guide/travel-tips', 'yiwu-guide/fairs-exhibitions', 'products/hardware-tools',
        'products/home-decor', 'products/kitchenware-household', 'services/quality-control',
        'contact', 'yiwu-guide/market-districts', 'products/wholesale-toys-baby'
    ];
    for (const r of redirects) {
        const regex = new RegExp(`href="https:\\/\\/chineseyiwu\\.com\\/([a-z]{2}\\/)?${r}"`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `href="https://chineseyiwu.com/$1${r}/"`);
            changed = true;
        }
    }

    if (changed) {
        console.log(`Updating Page ID: ${pageId}...`);
        const updateRes = await request(`/pages/${pageId}`, 'POST', { content: content });
        if (updateRes.status === 200) {
            console.log(`✅ Successfully updated Page ${pageId}`);
        } else {
            console.log(`❌ Failed to update Page ${pageId}. Status: ${updateRes.status}`);
        }
    } else {
        console.log(`No changes needed for Page ${pageId}`);
    }
}

async function run() {
  try {
    const pageIdsToFix = [1494, 1456, 1424];
    for (const id of pageIdsToFix) {
        await fixPage(id);
    }
    
    // Also fetch the first 20 pages just in case we missed any
    console.log("\nChecking recent pages...");
    const pagesRes = await request('/pages?per_page=20&context=edit');
    if (pagesRes.data && Array.isArray(pagesRes.data)) {
        for (const p of pagesRes.data) {
            if (!pageIdsToFix.includes(p.id)) {
                await fixPage(p.id);
            }
        }
    }

    console.log("\nAll done!");
  } catch (err) {
    console.error(err);
  }
}

run();