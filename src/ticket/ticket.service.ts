import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { GetTicketsFilterDto } from './dto/get-tickets-filter.dto';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TicketService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {
    
  }

  async create(createTicketDto: CreateTicketDto, user: User) {
    try { 
      const ticket = this.ticketRepository.create({
        ...createTicketDto,
        user});
      await this.ticketRepository.save(ticket);
      return ticket;
      
    } catch (error) {
      console.log(error);
    }
  }


  async findAllFiltered(filterDto: GetTicketsFilterDto) {
  // Creamos el objeto de opciones
  const {status, priority, userId} = filterDto;
  const whereOptions: any = {};

  if(status) whereOptions.status = status;
  if(priority) whereOptions.priority = priority;
  if(userId) whereOptions.user = { id: userId };

  return await this.ticketRepository.find({
    where: whereOptions,
    order: { createdAt: 'DESC' },
    relations: {user: true}
  });
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }



  async update(id: string, updateTicketDto: UpdateTicketDto) {
  // 1. Buscamos el ticket. Si no existe, findOne lanzará el error 404 que ya programaste.
    const ticket = await this.findOne(id);
  // 2. fusionamos los datos del DTO con el ticket encontrado
     this.ticketRepository.merge(ticket, updateTicketDto); 
  // 3. guardamos el ticket actualizado en la base de datos
      await this.ticketRepository.save(ticket);
    return ticket;
  }

  async remove(id: string) {
    const ticket = await this.findOne(id);
    
    await this.ticketRepository.softRemove(ticket);
    return ticket;
    }
}
