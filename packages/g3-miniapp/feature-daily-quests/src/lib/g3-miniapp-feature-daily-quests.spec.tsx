import { render } from '@testing-library/react';

import G3MiniappFeatureDailyQuests from './g3-miniapp-feature-daily-quests';

describe('G3MiniappFeatureDailyQuests', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<G3MiniappFeatureDailyQuests />);
    expect(baseElement).toBeTruthy();
  });
});
