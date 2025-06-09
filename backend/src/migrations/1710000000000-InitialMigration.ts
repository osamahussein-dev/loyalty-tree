import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1710000000000 implements MigrationInterface {
    name = 'InitialMigration1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create User table
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "email" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "name" varchar NOT NULL,
                "points" integer NOT NULL DEFAULT 0,
                "role" varchar NOT NULL DEFAULT 'user',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create Retailer table
        await queryRunner.query(`
            CREATE TABLE "retailer" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "name" varchar NOT NULL,
                "email" varchar UNIQUE NOT NULL,
                "password" varchar NOT NULL,
                "description" varchar,
                "logo" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // Create TreePlanting table
        await queryRunner.query(`
            CREATE TABLE "tree_planting" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "image_url" varchar NOT NULL,
                "status" varchar NOT NULL DEFAULT 'pending',
                "rejection_reason" varchar,
                "user_id" uuid NOT NULL,
                "latitude" float,
                "longitude" float,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_tree_planting_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);

        // Create Voucher table
        await queryRunner.query(`
            CREATE TABLE "voucher" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "title" varchar NOT NULL,
                "description" varchar NOT NULL,
                "points_required" integer NOT NULL,
                "quantity" integer NOT NULL,
                "expiry_date" TIMESTAMP NOT NULL,
                "retailer_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_voucher_retailer" FOREIGN KEY ("retailer_id") REFERENCES "retailer"("id") ON DELETE CASCADE
            )
        `);

        // Create VoucherRedemption table
        await queryRunner.query(`
            CREATE TABLE "voucher_redemption" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "voucher_id" uuid NOT NULL,
                "status" varchar NOT NULL DEFAULT 'active',
                "points_spent" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_redemption_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "fk_redemption_voucher" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE CASCADE
            )
        `);

        // Create extension for UUID support if not exists
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to handle foreign key constraints
        await queryRunner.query(`DROP TABLE "voucher_redemption"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TABLE "tree_planting"`);
        await queryRunner.query(`DROP TABLE "retailer"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
} 