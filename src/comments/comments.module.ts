import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Ticket } from 'src/ticket/entities';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([ Comment, Ticket ]),  
    UserModule
  ]
})
export class CommentsModule {}
