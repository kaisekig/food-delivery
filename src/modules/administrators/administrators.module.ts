import { Module } from "@nestjs/common";
import { AdministratorsController } from './administrators.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Administrator } from "./entities/administrators.entity";
import { AdministratorsService } from "./administrators.service";

@Module({
    imports: [TypeOrmModule.forFeature([Administrator])],
    providers: [AdministratorsService],
    controllers: [AdministratorsController],
    exports: [AdministratorsService]
})
export class AdministratorsModule {}