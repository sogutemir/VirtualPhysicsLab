const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// iOS için ağ bağlantı sorunlarını çözmek için
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
      return middleware(req, res, next);
    };
  },
};

// iOS için resolver ayarları
config.resolver = {
  ...config.resolver,
  assetExts: [...config.resolver.assetExts, 'ttf', 'woff', 'woff2', 'eot'],
};

module.exports = config;
