/* eslint-disable no-param-reassign */

const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  /**
   *
   * @param {import('webpack').Configuration} config
   */
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.alias = {
      ...config.resolve.alias,
      util: path.resolve(__dirname, 'util'),
      'common-util': path.resolve(__dirname, 'common-util'),
      components: path.resolve(__dirname, 'components'),
      images: path.resolve(__dirname, 'public/images'),
      store: path.resolve(__dirname, 'store'),
    };
    return config;
  },
  redirects: async () => [
    {
      source: '/',
      destination: '/buolas',
      permanent: false,
    },
    {
      source: '/veolas',
      destination: 'https://govern.olas.network/veolas',
      permanent: true,
    },
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
