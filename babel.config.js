module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated plugin must be last (https://docs.swmansion.com/react-native-reanimated)
  plugins: ['react-native-worklets-core/plugin'],
};
