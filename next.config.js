// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: ''
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/invite',
        destination: 'https://discord.com/oauth2/authorize?client_id=893558050504466482&permissions=269479308656&scope=bot%20applications.commands',
        permanent: false
      },
      {
        source: '/support-server',
        destination: 'https://discord.gg/98dD6NbfDU',
        permanent: false
      },
      {
        source: '/topgg',
        destination: 'https://top.gg/bot/893558050504466482/vote',
        permanent: false
      },
      {
        source: '/dbl',
        destination: 'https://discordbotlist.com/bots/robertify/upvote',
        permanent: false
      }
    ]
  }
}

module.exports = withNextra(nextConfig);
module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true },
);