import { registerAs } from '@nestjs/config';

import { ConfigEnum } from 'common';

export const jwtConfig = registerAs(ConfigEnum.JWT_CONFIG_KEY, () => ({
    secret: process.env.JWT_SECRET_KEY,
    accessTokenTTL: process.env.JWT_ACCESS_TOKEN_TTL,
    refreshTokenTTL: process.env.JWT_REFRESH_TOKEN_TTL,

    // audience: process.env.JWT_TOKEN_AUDIENCE,
    // issuer: process.env.JWT_TOKEN_ISSUER,
}));
