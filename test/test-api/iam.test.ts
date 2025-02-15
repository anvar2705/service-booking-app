import * as request from 'supertest';

import { SignUpDto } from 'models/iam/authentication/dto/sign-up.dto';

import { API_URL } from './constants';
import { loginAsAdmin } from './utils';

describe('iam module', () => {
    let accessTokenAdmin = null;
    let refreshTokenUser = null;
    let newUserId = null;

    const newUserDto: SignUpDto = {
        email: 'user600@mail.ru',
        password: '12345',
    };

    beforeAll(async () => {
        accessTokenAdmin = await loginAsAdmin();
    });

    it('register', async () => {
        const newUser = (
            await request(API_URL)
                .post('/auth/registration')
                .send(newUserDto)
                .expect(201)
        ).body;

        newUserId = newUser.id;

        expect(newUser).toHaveProperty('id');
        expect(newUser).toHaveProperty('email', newUserDto.email);
        expect(newUser).not.toHaveProperty('password');
        expect(newUser).toHaveProperty('roles');
        expect(newUser).toHaveProperty('created_at');
        expect(newUser).toHaveProperty('updated_at');

        expect(typeof newUser.id).toBe('number');
        expect(newUser.roles).toStrictEqual([{ id: 2, name: 'USER' }]);
    });

    it('login', async () => {
        const loginResponse = (
            await request(API_URL)
                .post('/auth/login')
                .send(newUserDto)
                .expect(200)
        ).body;

        expect(loginResponse).toHaveProperty('accessToken');
        expect(typeof loginResponse.accessToken).toBe('string');
        expect(loginResponse).toHaveProperty('refreshToken');
        expect(typeof loginResponse.refreshToken).toBe('string');

        refreshTokenUser = loginResponse.refreshToken;

        // TODO проверка авторизации с accessToken
    });

    it('refresh tokens', async () => {
        const refreshTokensResponse = (
            await request(API_URL)
                .post('/auth/refresh-tokens')
                .send({ refreshToken: refreshTokenUser })
                .expect(200)
        ).body;

        expect(refreshTokensResponse).toHaveProperty('accessToken');
        expect(typeof refreshTokensResponse.accessToken).toBe('string');
        expect(refreshTokensResponse).toHaveProperty('refreshToken');
        expect(typeof refreshTokensResponse.refreshToken).toBe('string');

        // TODO проверка авторизации с новым accessToken
    });

    afterAll(async () => {
        await request(API_URL)
            .delete(`/user/${newUserId}`)
            .set('Authorization', `Bearer ${accessTokenAdmin}`)
            .expect(200);
    });
});
