import { Module } from '@nestjs/common';
import { AdministratorsModule } from 'src/administrators/administrators.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AdministratorsModule,
    UsersModule
  ],
  controllers: [AuthController],
})
export class AuthModule {}
