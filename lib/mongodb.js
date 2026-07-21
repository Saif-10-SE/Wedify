import dns from 'dns/promises';
import dnsSync from 'dns';
import mongoose from 'mongoose';

// Prefer public DNS — Windows router DNS often breaks Node SRV (querySrv ECONNREFUSED)
try {
  dnsSync.setDefaultResultOrder('ipv4first');
  dnsSync.setServers(['8.8.8.8', '1.1.1.1', '9.9.9.9']);
} catch {
  // ignore
}

const RAW_URI = process.env.MONGODB_URI;

if (!RAW_URI) {
  console.warn(
    '[mongodb] MONGODB_URI is not set. API routes will fall back to JSON file storage.'
  );
}

/**
 * @type {{ conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null }}
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export function isMongoConfigured() {
  return Boolean(RAW_URI && String(RAW_URI).trim());
}

/**
 * Convert mongodb+srv:// to mongodb://host1,host2,host3/... so we avoid
 * the driver's broken querySrv on some Windows DNS setups.
 */
async function resolveSrvUri(uri) {
  if (!uri.startsWith('mongodb+srv://')) {
    return uri;
  }

  const withoutProtocol = uri.slice('mongodb+srv://'.length);
  const at = withoutProtocol.lastIndexOf('@');
  if (at < 0) return uri;

  const credentials = withoutProtocol.slice(0, at);
  const hostAndRest = withoutProtocol.slice(at + 1);
  const slash = hostAndRest.indexOf('/');
  const qMark = hostAndRest.indexOf('?');

  let host;
  let pathAndQuery;
  if (slash >= 0) {
    host = hostAndRest.slice(0, slash);
    pathAndQuery = hostAndRest.slice(slash);
  } else if (qMark >= 0) {
    host = hostAndRest.slice(0, qMark);
    pathAndQuery = `/${hostAndRest.slice(qMark)}`;
  } else {
    host = hostAndRest;
    pathAndQuery = '/';
  }

  // host may be "cluster0.xxx.mongodb.net"
  const hostname = host.split(':')[0];

  const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
  if (!srvRecords?.length) {
    throw new Error(`No SRV records for ${hostname}`);
  }

  const hosts = srvRecords
    .map((r) => `${r.name.replace(/\.$/, '')}:${r.port || 27017}`)
    .join(',');

  // Ensure tls + authSource + replicaSet for Atlas standard URI
  let txtOpts = '';
  try {
    const txt = await dns.resolveTxt(hostname);
    txtOpts = txt.flat().join('');
  } catch {
    // optional
  }

  let path = pathAndQuery || '/';
  const params = new URLSearchParams(
    path.includes('?') ? path.slice(path.indexOf('?') + 1) : ''
  );
  if (!params.has('tls') && !params.has('ssl')) params.set('tls', 'true');
  if (!params.has('authSource')) params.set('authSource', 'admin');
  if (txtOpts) {
    const fromTxt = new URLSearchParams(txtOpts);
    for (const [k, v] of fromTxt.entries()) {
      if (!params.has(k)) params.set(k, v);
    }
  }

  const dbPath = path.includes('?')
    ? path.slice(0, path.indexOf('?'))
    : path.startsWith('/')
      ? path
      : `/${path}`;
  const qs = params.toString();
  return `mongodb://${credentials}@${hosts}${dbPath || '/'}?${qs}`;
}

export async function connectDB() {
  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const uri = await resolveSrvUri(RAW_URI.trim());
      const m = await mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 25000,
        connectTimeoutMS: 25000,
        family: 4,
      });
      console.log('[mongodb] connected:', m.connection.name);
      return m;
    })().catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
