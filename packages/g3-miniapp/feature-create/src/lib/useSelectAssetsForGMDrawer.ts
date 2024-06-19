import { parseAsBoolean, useQueryState } from 'nuqs';

export const useSelectAssetsForGMDrawer = () => {
  return useQueryState(
    `selectAssetGMDrawer`,
    parseAsBoolean.withDefault(false)
  );
};
