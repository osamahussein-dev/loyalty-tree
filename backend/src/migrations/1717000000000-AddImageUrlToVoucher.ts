import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToVoucher1717000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "voucher" 
            ADD COLUMN IF NOT EXISTS "image_url" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "voucher" 
            DROP COLUMN IF EXISTS "image_url"
        `);
    }
}
