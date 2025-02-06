export const TOAST_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export const TOAST_CONFIG = {
  DEFAULT: {
    duration: 3000,
    isClosable: true,
  },
  LOADING: {
    duration: 1000,
  },
} as const;
