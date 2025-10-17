import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTaskRelatedTables1760716056505 implements MigrationInterface {
    name = 'CreateTaskRelatedTables1760716056505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "taskId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "taskId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_9adf2d3106c6dc87d6262ccadfe" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_d038705a567505c35b669ab00ca" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_d038705a567505c35b669ab00ca"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_9adf2d3106c6dc87d6262ccadfe"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "audit_logs" ADD "taskId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "userId"`);
    }

}
