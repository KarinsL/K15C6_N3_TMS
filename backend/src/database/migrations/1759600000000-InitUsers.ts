import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUsers1759600000000 implements MigrationInterface {
  name = 'InitUsers1759600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            BIGSERIAL PRIMARY KEY,
        "email"         VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "full_name"     VARCHAR(255) NOT NULL,
        "role"          VARCHAR(32)  NOT NULL,
        "active"        BOOLEAN      NOT NULL DEFAULT TRUE,
        "created_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "chk_users_role" CHECK ("role" IN (
          'GUEST', 'STUDENT', 'INSTRUCTOR', 'TA',
          'TRAINING_MANAGER', 'ADMISSIONS', 'ACCOUNTANT', 'ADMIN'
        ))
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
