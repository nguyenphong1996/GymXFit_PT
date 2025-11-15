module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@context': './src/context',
          '@components': './src/components',
          '@features': './src/features',
          '@integrations': './src/integrations',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};
