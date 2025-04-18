import { RolesEnum } from 'models/role/constants';

import { ActiveUserData } from '../decorators';

export const checkAdmin = (user: ActiveUserData) =>
    Boolean(user.roles.includes(RolesEnum.ADMIN));
