import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToTask1760965173532 implements MigrationInterface {
    name = 'AddUserIdToTask1760965173532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "userId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "userId"`);
    }

}
