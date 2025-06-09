import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRedemptionCodeAndExpiry1749485000000 implements MigrationInterface {
    name = 'AddRedemptionCodeAndExpiry1749485000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First add the columns as nullable
        await queryRunner.query(`ALTER TABLE "voucher_redemption" ADD "redemption_code" character varying`);
        await queryRunner.query(`ALTER TABLE "voucher_redemption" ADD "expires_at" TIMESTAMP`);

        // Generate redemption codes for existing records
        await queryRunner.query(`
            UPDATE "voucher_redemption" 
            SET "redemption_code" = 'VR-' || UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 8)),
                "expires_at" = "created_at" + INTERVAL '30 days'
            WHERE "redemption_code" IS NULL OR "redemption_code" = ''
        `);

        // Now make redemption_code NOT NULL and add unique constraint
        await queryRunner.query(`ALTER TABLE "voucher_redemption" ALTER COLUMN "redemption_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "voucher_redemption" ADD CONSTRAINT "UQ_voucher_redemption_redemption_code" UNIQUE ("redemption_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher_redemption" DROP CONSTRAINT "UQ_voucher_redemption_redemption_code"`);
        await queryRunner.query(`ALTER TABLE "voucher_redemption" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "voucher_redemption" DROP COLUMN "redemption_code"`);
    }
}
