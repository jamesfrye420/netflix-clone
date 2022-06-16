/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = (phase) => {
  const reactStrictMode = true;
  const compiler = {
    styledComponents: true,
  };

  const redirects = async () => {
    return [
      {
        source: '/browse',
        destination: '/browse/movies',
        permanent: true,
      },
    ];
  };

  const images = {
    domains: ['image.tmdb.org'],
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode,
      images,
      compiler,
      env: {
        url: 'http://localhost:8080',
      },
      redirects,
    };
  }

  return {
    images,
    env: {
      url: 'https://e913-143-110-184-39.in.ngrok.io',
    },
    compiler,
    redirects,
  };
};

module.exports = nextConfig;
