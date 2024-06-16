import { render } from '@testing-library/react';

import DataAccessHome from './data-access-home';

describe('DataAccessHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DataAccessHome />);
    expect(baseElement).toBeTruthy();
  });
});
