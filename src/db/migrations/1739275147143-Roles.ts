import { MigrationInterface, QueryRunner } from 'typeorm';

import { Role } from 'models/role/entities/role.entity';

export class Roles1739275147143 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminRole = queryRunner.manager.create(Role, { name: 'ADMIN' });
        await queryRunner.manager.save(adminRole);

        const userRole = queryRunner.manager.create(Role, { name: 'USER' });
        await queryRunner.manager.save(userRole);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const adminRole = await queryRunner.manager.findOneBy(Role, {
            name: 'ADMIN',
        });
        await queryRunner.manager.remove(Role, adminRole);

        const userRole = await queryRunner.manager.findOneBy(Role, {
            name: 'USER',
        });
        await queryRunner.manager.remove(Role, userRole);
    }
}
