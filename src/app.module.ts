import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './administrators/administrators.entity';
import { AdministratorModel } from './administrators/administrators.model';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { Category } from './categories/categories.entity';
import { CategoriesModule } from './categories/categories.module';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'food_delivery',
      entities: [
        Administrator,
        User,
        Category,
        
      ],
      synchronize: true
    }),
    
    AuthModule,
    AdministratorModel,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
