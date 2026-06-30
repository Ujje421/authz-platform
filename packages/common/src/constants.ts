export const CONSISTENCY_LEVEL = {
  AT_LEAST_AS_FRESH: 'at_least_as_fresh',
  FULLY_CONSISTENT: 'fully_consistent',
  MINIMIZE_LATENCY: 'minimize_latency',
} as const;

export type ConsistencyLevel = typeof CONSISTENCY_LEVEL[keyof typeof CONSISTENCY_LEVEL];
