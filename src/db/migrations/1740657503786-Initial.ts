import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1740657503786 implements MigrationInterface {
    name = 'Initial1740657503786';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "surname" character varying, "patronymic" character varying, "photo_url" character varying, "userId" integer, CONSTRAINT "REL_f4b0d329c4a3cf79ffe9d56504" UNIQUE ("userId"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "record" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_name" character varying, "client_phone" character varying, "time_start" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "comment" character varying, "serviceUuid" uuid, CONSTRAINT "PK_96aea1b2ae86207fb1852c03017" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."service_type_enum" AS ENUM('personal', 'group')`,
        );
        await queryRunner.query(
            `CREATE TABLE "service" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price_from" integer NOT NULL, "price_to" integer, "duration" integer NOT NULL, "type" "public"."service_type_enum" NOT NULL DEFAULT 'personal', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name"), CONSTRAINT "PK_c5c74b525a89a34199d317da0d8" PRIMARY KEY ("uuid"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_7b4e17a669299579dfa55a3fc35" PRIMARY KEY ("userId", "roleId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_ab40a6f0cd7d3ebfcce082131f" ON "user_role" ("userId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_dba55ed826ef26b5b22bd39409" ON "user_role" ("roleId") `,
        );
        await queryRunner.query(
            `CREATE TABLE "service_employee" ("serviceUuid" uuid NOT NULL, "employeeId" integer NOT NULL, CONSTRAINT "PK_d2789ea6ae22ec987511b85eee6" PRIMARY KEY ("serviceUuid", "employeeId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_c57bd8d0ded59f7af456e87242" ON "service_employee" ("serviceUuid") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_762c8d35cd0c383b44f8bab655" ON "service_employee" ("employeeId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "employee" ADD CONSTRAINT "FK_f4b0d329c4a3cf79ffe9d565047" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "record" ADD CONSTRAINT "FK_c23cd7e9d9d40254534bb59676f" FOREIGN KEY ("serviceUuid") REFERENCES "service"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_role" ADD CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "service_employee" ADD CONSTRAINT "FK_c57bd8d0ded59f7af456e872426" FOREIGN KEY ("serviceUuid") REFERENCES "service"("uuid") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "service_employee" ADD CONSTRAINT "FK_762c8d35cd0c383b44f8bab6554" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "service_employee" DROP CONSTRAINT "FK_762c8d35cd0c383b44f8bab6554"`,
        );
        await queryRunner.query(
            `ALTER TABLE "service_employee" DROP CONSTRAINT "FK_c57bd8d0ded59f7af456e872426"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_role" DROP CONSTRAINT "FK_dba55ed826ef26b5b22bd39409b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "record" DROP CONSTRAINT "FK_c23cd7e9d9d40254534bb59676f"`,
        );
        await queryRunner.query(
            `ALTER TABLE "employee" DROP CONSTRAINT "FK_f4b0d329c4a3cf79ffe9d565047"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_762c8d35cd0c383b44f8bab655"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_c57bd8d0ded59f7af456e87242"`,
        );
        await queryRunner.query(`DROP TABLE "service_employee"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_dba55ed826ef26b5b22bd39409"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_ab40a6f0cd7d3ebfcce082131f"`,
        );
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TYPE "public"."service_type_enum"`);
        await queryRunner.query(`DROP TABLE "record"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }
}
