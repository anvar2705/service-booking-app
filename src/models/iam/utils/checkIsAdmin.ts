import { RolesEnum } from 'models/role/constants';

import { ActiveUserData } from '../decorators';

export const checkIsAdmin = (user: ActiveUserData) =>
    Boolean(user.roles.includes(RolesEnum.ADMIN));
