import { parseAsBoolean, useQueryState } from 'nuqs';

export const useHelpDrawer = () => {
  return useQueryState('help', parseAsBoolean.withDefault(false));
};
