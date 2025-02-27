import { MigrationInterface, QueryRunner } from 'typeorm';

import { RolesEnum } from 'models/role/constants';
import { Role } from 'models/role/entities/role.entity';

export class Roles1740657568000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminRole = queryRunner.manager.create(Role, {
            name: RolesEnum.ADMIN,
        });
        await queryRunner.manager.save(adminRole);

        const companyOwnerRole = queryRunner.manager.create(Role, {
            name: RolesEnum.COMPANY_OWNER,
        });
        await queryRunner.manager.save(companyOwnerRole);

        const employeeRole = queryRunner.manager.create(Role, {
            name: RolesEnum.EMPLOYEE,
        });
        await queryRunner.manager.save(employeeRole);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const adminRole = await queryRunner.manager.findOneBy(Role, {
            name: RolesEnum.ADMIN,
        });
        await queryRunner.manager.remove(Role, adminRole);

        const companyOwnerRole = await queryRunner.manager.findOneBy(Role, {
            name: RolesEnum.COMPANY_OWNER,
        });
        await queryRunner.manager.remove(Role, companyOwnerRole);

        const employeeRole = await queryRunner.manager.findOneBy(Role, {
            name: RolesEnum.EMPLOYEE,
        });
        await queryRunner.manager.remove(Role, employeeRole);
    }
}
