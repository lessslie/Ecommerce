import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { Category } from "src/entities/categories.entity";






@Module({
    imports:[TypeOrmModule.forFeature([Category])],
    controllers:[CategoriesController],
    providers:[CategoriesService,CategoriesRepository],
})

export class CategoriesModule{}