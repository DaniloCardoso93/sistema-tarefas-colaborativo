import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskAssignees1761078144654 implements MigrationInterface {
    name = 'CreateTaskAssignees1761078144654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_assignees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_e23bc1438f7bb32f41e8d493e78" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_8b1600551063c485554bca74c13" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_8b1600551063c485554bca74c13"`);
        await queryRunner.query(`DROP TABLE "task_assignees"`);
    }

}
