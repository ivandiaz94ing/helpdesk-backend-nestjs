import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Equipo } from 'src/equipo/entities/equipo.entity';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      User,
      Equipo
    ]),  
      UserModule,
      StorageModule
]
})
export class TicketModule {}
