import { Module } from '@nestjs/common';
import { AdministratorModule } from 'src/administrators/administrators.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [AdministratorModule],
  providers: [],
  controllers: [AuthenticationController]
})
export class AuthenticationModule {}
