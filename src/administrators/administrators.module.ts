import { Module } from "@nestjs/common";
import { AdministratorsController } from './administrators.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Administrator } from "./administrators.entity";
import { AdministratorService } from "./administrators.service";

@Module({
    imports: [TypeOrmModule.forFeature([Administrator])],
    providers: [AdministratorService],
    controllers: [AdministratorsController],
    exports: [AdministratorService]
})
export class AdministratorsModule {}