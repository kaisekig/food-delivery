import { Module } from '@nestjs/common';
import { AdministratorsModule } from 'src/administrators/administrators.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [AdministratorsModule],
  controllers: [AuthController],
})
export class AuthModule {}
