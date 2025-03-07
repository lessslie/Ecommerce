import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderDetailNullable1738611781398 implements MigrationInterface {
    name = 'UpdateOrderDetailNullable1738611781398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_details" ADD "productName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order_details" ADD "productPrice" numeric(10,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_details" DROP COLUMN "productPrice"`);
        await queryRunner.query(`ALTER TABLE "order_details" DROP COLUMN "productName"`);
    }

}
