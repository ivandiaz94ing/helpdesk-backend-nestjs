import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { EquipoModule } from 'src/equipo/equipo.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserModule } from 'src/user/user.module';
import { CommentsModule } from 'src/comments/comments.module';


@Module({
  imports: [ 
    EquipoModule, 
    TicketModule, 
    CommentsModule,
    UserModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
