import { Module } from '@nestjs/common';
import { TicketModule } from './ticket/ticket.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { CommentsModule } from './comments/comments.module';
import { EquipoModule } from './equipo/equipo.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: true,
        // ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false,
        autoLoadEntities: true,
        synchronize: true,
        // entities: [User]
      }),

    UserModule, TicketModule, CommentsModule, EquipoModule, StorageModule],
  providers: [],
})
export class AppModule {}
