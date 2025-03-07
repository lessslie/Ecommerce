import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderDetail1738610575804 implements MigrationInterface {
    name = 'UpdateOrderDetail1738610575804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Agregar columnas permitiendo NULL inicialmente
        await queryRunner.query(`ALTER TABLE "order_details" ADD "productName" character varying NULL`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD "productPrice" numeric(10,2) NULL`);

        // Opcional: Si quieres hacer NOT NULL después de migrar los datos existentes
        // await queryRunner.query(`ALTER TABLE "order_details" ALTER COLUMN "productName" SET NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "order_details" ALTER COLUMN "productPrice" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_details" DROP COLUMN "productPrice"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP COLUMN "productName"`);
    }
}