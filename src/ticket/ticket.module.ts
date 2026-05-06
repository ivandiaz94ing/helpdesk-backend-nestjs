import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [
    TypeOrmModule.forFeature([
      Ticket
    ]),  
      UserModule
]
})
export class TicketModule {}
