export const ROLES = {
  USER: 'user',
  PROVIDER: 'provider',
  ADMIN: 'admin',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_IDS = {
  USER: 1,
  PROVIDER: 2,
  ADMIN: 3,
} as const;
