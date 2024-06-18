import { render } from '@testing-library/react';

import G3MiniappFeatureHome from './g3-miniapp-feature-home';

describe('G3MiniappFeatureHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<G3MiniappFeatureHome />);
    expect(baseElement).toBeTruthy();
  });
});
