/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Style/lint nits must not block Vercel production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['www.rpgcc.com', 'rpgcc.com', 'falettishotel.com.pk', 'i0.wp.com', 'www.pchotels.com', 'pchotels.com'],
  },
  // Pages import catalogService helpers for SSR; keep mongoose/dns out of the client bundle.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        mongoose: false,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
