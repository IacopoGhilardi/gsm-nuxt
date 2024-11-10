import daisyui from "daisyui";

module.exports = {
    plugins: [require('daisyui')],
    daisyui: {
      themes: ['light']
    },
    theme: {
      extend: {
        colors: {
          primary: '#2E4052',
          primaryLight: '#EAE3E0',
          secondary: '#2d3748',
          accent: '#EE6352',
        },
      },
    },
  };
  