const fs = require('fs');
const path = require('path');
const https = require('https');

const dataPath = path.join(__dirname, '..', 'data', 'marquees.js');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'venues');

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadFile(res.headers.location, filePath).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed ${url} with status ${res.statusCode}`));
          return;
        }

        const writer = fs.createWriteStream(filePath);
        res.pipe(writer);

        writer.on('finish', () => {
          writer.close(resolve);
        });

        writer.on('error', reject);
      })
      .on('error', reject);
  });
}

async function main() {
  let content = fs.readFileSync(dataPath, 'utf8');
  const urls = [...new Set(content.match(/https:\/\/images\.unsplash\.com\/[^"\s]+/g) || [])];

  if (!urls.length) {
    console.log('No Unsplash URLs found in marquees data.');
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const fileName = `venue-${String(i + 1).padStart(2, '0')}.jpg`;
    const filePath = path.join(outputDir, fileName);
    const publicPath = `/images/venues/${fileName}`;

    // Keep existing photos but serve from local static assets.
    await downloadFile(url, filePath);
    content = content.split(url).join(publicPath);
    console.log(`Saved ${fileName}`);
  }

  fs.writeFileSync(dataPath, content, 'utf8');
  console.log(`Downloaded and remapped ${urls.length} images.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
