import { RolesEnum } from './constants';

export type Role = (typeof RolesEnum)[keyof typeof RolesEnum];
