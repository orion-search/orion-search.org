module.exports = {
  stories: [
    "../src/**/*.stories.js",
    "../src/components/shared/**/*.stories.js",
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        plugins: ["emotion"],
        presets: [require.resolve("@emotion/babel-preset-css-prop")],
      },
    });
    config.resolve.extensions.push(".js", ".jsx");
    return config;
  },
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-actions",
    "@storybook/addon-links",
    "@storybook/addon-knobs",
  ],
};
