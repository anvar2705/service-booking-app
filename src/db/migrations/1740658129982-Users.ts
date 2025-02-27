import { genSalt, hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { RolesEnum } from 'models/role/constants';
import { Role } from 'models/role/entities/role.entity';
import { User } from 'models/user/entities/user.entity';

const defaultUsername = 'admin';
const defaultEmail = 'admin@mail.ru';
const defaultPassword = '12345';

export class Users1740658129982 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const salt = await genSalt();
        const password = await hash(defaultPassword, salt);

        const adminRole = await queryRunner.manager.findOneBy(Role, {
            name: RolesEnum.ADMIN,
        });

        if (adminRole) {
            const admin = queryRunner.manager.create(User, {
                username: defaultUsername,
                email: defaultEmail,
                password,
                roles: [adminRole],
            });
            await queryRunner.manager.save(admin);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const admin = await queryRunner.manager.findOneBy(User, {
            username: defaultUsername,
        });
        if (admin) await queryRunner.manager.remove(User, admin);
    }
}
