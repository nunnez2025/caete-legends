module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
        browsers: [
          'last 2 versions',
          '> 1%',
          'not dead',
          'not ie 11'
        ]
      },
      useBuiltIns: 'usage',
      corejs: 3
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    'babel-plugin-styled-components'
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs']
    },
    production: {
      plugins: [
        'transform-remove-console',
        'transform-remove-debugger'
      ]
    }
  }
};