/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['i.robertify.me']
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
