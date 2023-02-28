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
        source: '/support',
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

module.exports = nextConfig
