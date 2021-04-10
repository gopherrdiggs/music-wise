import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  taskQueue: 'async',
  outputTargets: [{
    copy: [
      { src: '_redirects' },
      { src: 'app-settings.json' }
    ],
    type: 'www',
    serviceWorker: null
  }],
};
