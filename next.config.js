
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');
const loaderUtils = require('loader-utils');

// based on https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts
const hashOnlyIdent = (context, _, exportName) =>
    loaderUtils
        .getHashDigest(
            Buffer.from(
                `filePath:$#className:$`,
            ),
            'md4',
            'base64',
            6,
        )
        .replace(/^(-?\d|--)/, '_$1');


/** @type {import('next').NextConfig} */
moduleExports = {
  webpack(config, { dev }) {
    const rules = config.module.rules
        .find((rule) => typeof rule.oneOf === 'object')
        .oneOf.filter((rule) => Array.isArray(rule.use));

    if (!dev)
      rules.forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
              moduleLoader.loader?.includes('css-loader') &&
              !moduleLoader.loader?.includes('postcss-loader')
          )
            moduleLoader.options.modules.getLocalIdent = hashOnlyIdent;

          // earlier below statements were sufficient:
          // delete moduleLoader.options.modules.getLocalIdent;
          // moduleLoader.options.modules.localIdentName = '[hash:base64:6]';
        });
      });

    return config;
  },
  images: {
    domains: ['i.robertify.me', 'i.imgur.com']
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

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);