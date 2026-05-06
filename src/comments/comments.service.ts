import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from 'src/ticket/entities';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
    constructor(
      @InjectRepository(Comment)
      private readonly commentRepository: Repository<Comment>,

      @InjectRepository(Ticket)
      private readonly ticketRepository: Repository<Ticket>

    ) {
      
    }

  async create(createCommentDto: CreateCommentDto, idTicket: string, user: User) {
    //1. Verificar que el ticket existe
    const ticket = await this.ticketRepository.findOneBy({id: idTicket});
    if (!ticket)
      throw new NotFoundException('Ticket not found');
    //2. Crear el comentario asingandole el ticket y el usuario
    const comment = this.commentRepository.create({
      ...createCommentDto,
      ticket,
      user
    });
    return await this.commentRepository.save(comment);
  }

  // findAll() {
  //   return `This action returns all comments`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }

  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} comment`;
  // }
}
