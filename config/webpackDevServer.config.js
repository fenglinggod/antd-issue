module.exports = {
  clientLogLevel: 'none',
  historyApiFallback: {
    disableDotRule: true,
  },
  hot: true,
  inline: true,
  contentBase: false,
  quiet: true,
  compress: true,
  open: true,
  proxy: {
    '/tRtApi': {
      target: 'http://flight.tianjin-air.com/mhtest/api/tRetailAPI',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/tRtApi': '',
      },
    },
    '/locations': {
      target: 'http://flight.tianjin-air.com/mhtest/api/LocationAPI',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/locations': '',
      },
    },
    '/profileApi': {
      target: 'http://10.225.64.92/mhtest/api/uc/v1/profile',
      // target: 'http://10.225.5.7:8080/gs/api/uc/v1.0/profile/v1/profile/',
      // target: 'http://172.20.19.186:8108',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/profileApi': '',
      },
    },
    '/dotCms': {
      target: 'http://10.225.5.10:8180',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/dotCms': '',
      },
    },
    '/dlcms': {
      target: 'http://192.168.22.110:8080',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        '^/dlcms': '',
      },
    },
  },
};
