module.exports = {
  extends: ['next'],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
};
