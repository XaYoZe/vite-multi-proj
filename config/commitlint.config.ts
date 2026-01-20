import type { UserConfig } from '@commitlint/types';
// import config from '@commitlint/config-conventional';

export default {
  // Use the conventional commit rules as a base.
  extends: ['@commitlint/config-conventional'],
} satisfies UserConfig;