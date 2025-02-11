import { genSalt, hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Role } from 'models/role/entities/role.entity';
import { User } from 'models/user/entities/user.entity';

const defaultPassword = '12345';
const defaultEmail = 'admin@mail.ru';

export class Users1739275760821 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = await genSalt();
        const password = await hash(defaultPassword, salt);

        const adminRole = await queryRunner.manager.findOneBy(Role, {
            name: 'ADMIN',
        });

        if (adminRole) {
            const admin = queryRunner.manager.create(User, {
                email: defaultEmail,
                password,
                roles: [adminRole],
            });
            await queryRunner.manager.save(admin);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const admin = await queryRunner.manager.findOneBy(User, {
            email: defaultEmail,
        });
        if (admin) await queryRunner.manager.remove(User, admin);
    }
}
