import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UserToken } from './entities/users.token.entity';
import { UsersService } from './users.service';

@Module({
  imports:[TypeOrmModule.forFeature([User, UserToken])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
