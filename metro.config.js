const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/private/defaults/exclusionList").default;

const config = getDefaultConfig(__dirname);

config.resolver.blockList = exclusionList([
  /\/\.cache\/.*/,
  /\/\.expo-home\/.*/,
  /\/\.gradle\/.*/,
  /\/\.local-home\/.*/,
  /\/android\/\.gradle\/.*/,
  /\/android\/app\/build\/.*/,
  /\/android\/build\/.*/,
]);
config.resolver.useWatchman = true;

module.exports = config;
