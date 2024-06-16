import { render } from '@testing-library/react';

import FeatureHome from './feature-home';

describe('FeatureHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeatureHome />);
    expect(baseElement).toBeTruthy();
  });
});
