import * as request from 'supertest';

import { CreateUserDto } from 'models/user/dto/create-user.dto';
import { UpdateUserDto } from 'models/user/dto/update-user.dto';

import { API_URL } from './constants';
import { loginAsAdmin, loginAsUser } from './utils';

describe('user module', () => {
    let accessToken = null;
    let newUserId = null;

    const newUserDto: CreateUserDto = {
        email: 'user500@mail.ru',
        password: '12345',
    };

    const updatedUserDto: UpdateUserDto = {
        email: 'user501@mail.ru',
        password: '54321',
        roles: [1, 2],
    };

    beforeAll(async () => {
        accessToken = await loginAsAdmin();
    });

    it('chenk authorization', async () => {
        const accessTokenUser = await loginAsUser();

        await request(API_URL)
            .post('/user')
            .send(newUserDto)
            .set('Authorization', `Bearer ${accessTokenUser}`)
            .expect(401);

        await request(API_URL)
            .patch(`/user/500`)
            .send(newUserDto)
            .set('Authorization', `Bearer ${accessTokenUser}`)
            .expect(401);

        await request(API_URL)
            .get(`/user`)
            .set('Authorization', `Bearer ${accessTokenUser}`)
            .expect(401);

        await request(API_URL)
            .get(`/user/500`)
            .set('Authorization', `Bearer ${accessTokenUser}`)
            .expect(401);

        await request(API_URL)
            .delete(`/user/500`)
            .set('Authorization', `Bearer ${accessTokenUser}`)
            .expect(401);
    });

    it('create a new user', async () => {
        const newUser = (
            await request(API_URL)
                .post('/user')
                .send(newUserDto)
                .set('Authorization', `Bearer ${accessToken}`)
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

    it('update the user', async () => {
        const updatedUser = (
            await request(API_URL)
                .patch(`/user/${newUserId}`)
                .send(updatedUserDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(updatedUser).toHaveProperty('id');
        expect(updatedUser).toHaveProperty('email', updatedUserDto.email);
        expect(updatedUser).not.toHaveProperty('password');
        expect(updatedUser).toHaveProperty('roles');
        expect(updatedUser).toHaveProperty('created_at');
        expect(updatedUser).toHaveProperty('updated_at');

        expect(typeof updatedUser.id).toBe('number');
        expect(updatedUser.roles).toStrictEqual([
            { id: 1, name: 'ADMIN' },
            { id: 2, name: 'USER' },
        ]);
    });

    it('find all users', async () => {
        const foundUsers = (
            await request(API_URL)
                .get(`/user`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(foundUsers).toHaveProperty('total');
        expect(foundUsers).toHaveProperty('offset', 0);
        expect(foundUsers).toHaveProperty('items');

        expect(typeof foundUsers.total).toBe('number');
        expect(Array.isArray(foundUsers.items)).toBe(true);
    });

    it('find the user', async () => {
        const foundUser = (
            await request(API_URL)
                .get(`/user/${newUserId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(foundUser).toHaveProperty('id', newUserId);
        expect(foundUser).toHaveProperty('email', updatedUserDto.email);
        expect(foundUser).not.toHaveProperty('password');
        expect(foundUser).toHaveProperty('roles');
        expect(foundUser).toHaveProperty('created_at');
        expect(foundUser).toHaveProperty('updated_at');

        expect(typeof foundUser.id).toBe('number');
        expect(foundUser.roles).toStrictEqual([
            { id: 1, name: 'ADMIN' },
            { id: 2, name: 'USER' },
        ]);
    });

    it('delete the user', async () => {
        const response = (
            await request(API_URL)
                .delete(`/user/${newUserId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(response).toStrictEqual({
            raw: [],
            affected: 1,
        });

        await request(API_URL)
            .get(`/user/${newUserId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
    });
});
