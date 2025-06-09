import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRetailerVoucherRelationship1749481600000 implements MigrationInterface {
    name = 'UpdateRetailerVoucherRelationship1749481600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Get all foreign key constraints for the voucher table
        const foreignKeys = await queryRunner.query(
            `SELECT tc.constraint_name FROM information_schema.table_constraints tc
             WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'voucher'
             AND EXISTS (
                SELECT 1 FROM information_schema.constraint_column_usage ccu
                WHERE ccu.constraint_name = tc.constraint_name
                AND ccu.table_name = 'retailer'
             )`
        );

        if (foreignKeys && foreignKeys.length > 0) {
            const constraintName = foreignKeys[0].constraint_name;

            // Drop existing foreign key constraint
            await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "${constraintName}"`);

            // Add new foreign key constraint with CASCADE on update
            await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("retailer_id") REFERENCES "retailer"("id") ON DELETE NO ACTION ON UPDATE CASCADE`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Get all foreign key constraints for the voucher table
        const foreignKeys = await queryRunner.query(
            `SELECT tc.constraint_name FROM information_schema.table_constraints tc
             WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'voucher'
             AND EXISTS (
                SELECT 1 FROM information_schema.constraint_column_usage ccu
                WHERE ccu.constraint_name = tc.constraint_name
                AND ccu.table_name = 'retailer'
             )`
        );

        if (foreignKeys && foreignKeys.length > 0) {
            const constraintName = foreignKeys[0].constraint_name;

            // Revert back to original foreign key constraint
            await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "${constraintName}"`);
            await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("retailer_id") REFERENCES "retailer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        }
    }
}
