import fs from 'fs';
import path from 'path';

/**
 * Simple JSON file store used when MONGODB_URI is not configured.
 * Keeps the app runnable for local demos without Atlas.
 */
export function createJsonStore(fileName) {
  const dataDir = path.join(process.cwd(), 'data', 'store');
  const filePath = path.join(dataDir, fileName);

  function ensure() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  }

  return {
    read() {
      ensure();
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch {
        return [];
      }
    },
    write(items) {
      ensure();
      fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
    },
  };
}
