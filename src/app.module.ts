import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './administrators/administrators.entity';
import { AdministratorModule } from './administrators/administrators.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';

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
        Administrator
      ],
      synchronize: true
    }),

    AuthenticationModule,
    AdministratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
