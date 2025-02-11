import * as request from 'supertest';

import { API_URL } from './constants';

export const loginAsAdmin = async () => {
    const response = (
        await request(API_URL).post('/auth/login').send({
            email: 'admin@mail.ru',
            password: '12345',
        })
    ).body;

    return response.accessToken;
};
