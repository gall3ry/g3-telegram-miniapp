'use client';

import ReactDOM from 'react-dom';

export function PreloadResources() {
  ReactDOM.preload('https://unpkg.com/rive-canvas@0.7.6/rive.wasm', {
    as: 'fetch',
    crossOrigin: 'anonymous',
  });

  // gm1, gm2, gm3
  const riveAssets = [
    '/rive/gm/gm1.riv',
    '/rive/gm/gm2.riv',
    '/rive/gm/gm3.riv',
  ];
  for (const asset of riveAssets) {
    ReactDOM.preload(asset, {
      as: 'fetch',
      crossOrigin: 'anonymous',
    });
  }

  return null;
}
