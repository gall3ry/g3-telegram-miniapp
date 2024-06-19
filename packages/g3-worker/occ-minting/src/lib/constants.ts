export enum QUEUE_NAMES {
  OCC_MINTING = 'occ-minting',
}

export const QUEUE_TO_PROCESS = {
  [QUEUE_NAMES.OCC_MINTING]: {
    mint: 'mint',
  },
} as const satisfies Record<QUEUE_NAMES, Record<string, string>>;

export type OccMintingJobData = {
  foo: string;
};
