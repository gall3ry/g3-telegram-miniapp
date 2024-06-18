import { getJestProjectsAsync } from '@nx/jest';
import { Config } from 'jest';

export default async () =>
  ({
    projects: await getJestProjectsAsync(),
    passWithNoTests: true,
  } satisfies Config);
