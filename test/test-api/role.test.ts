import * as request from 'supertest';

import { CreateRoleDto } from 'models/role/dto/create-role.dto';
import { UpdateRoleDto } from 'models/role/dto/update-role.dto';

import { API_URL } from './constants';
import { loginAsAdmin } from './utils';

describe('role module', () => {
    let accessToken = null;
    let newRoleId = null;

    const newRoleDto: CreateRoleDto = {
        name: 'SOME_ROLE',
    };

    const updatedRoleDto: UpdateRoleDto = {
        name: 'SOME_ROLE_2',
    };

    beforeEach(async () => {
        accessToken = await loginAsAdmin();
    });

    it('create a new role', async () => {
        const newRole = (
            await request(API_URL)
                .post('/role')
                .send(newRoleDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
        ).body;

        newRoleId = newRole.id;

        expect(newRole).toHaveProperty('id');
        expect(newRole).toHaveProperty('name');
        expect(newRole).toHaveProperty('created_at');
        expect(newRole).toHaveProperty('updated_at');

        expect(typeof newRole.id).toBe('number');
    });

    it('update the role', async () => {
        const updatedRole = (
            await request(API_URL)
                .patch(`/role/${newRoleId}`)
                .send(updatedRoleDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(updatedRole).toHaveProperty('id');
        expect(updatedRole).toHaveProperty('name', updatedRoleDto.name);

        expect(typeof updatedRole.id).toBe('number');
    });

    it('find all roles', async () => {
        const foundRoles = (
            await request(API_URL)
                .get(`/role`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(foundRoles).toHaveProperty('total');
        expect(foundRoles).toHaveProperty('offset', 0);
        expect(foundRoles).toHaveProperty('items');

        expect(typeof foundRoles.total).toBe('number');
        expect(Array.isArray(foundRoles.items)).toBe(true);
    });

    it('find the role', async () => {
        const foundRole = (
            await request(API_URL)
                .get(`/role/${newRoleId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(foundRole).toHaveProperty('id', newRoleId);
        expect(foundRole).toHaveProperty('name', updatedRoleDto.name);

        expect(typeof foundRole.id).toBe('number');
    });

    it('delete the role', async () => {
        const response = (
            await request(API_URL)
                .delete(`/role/${newRoleId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200)
        ).body;

        expect(response).toStrictEqual({
            raw: [],
            affected: 1,
        });

        await request(API_URL)
            .get(`/role/${newRoleId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(404);
    });
});
