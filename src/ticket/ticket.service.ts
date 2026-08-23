import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { GetTicketsFilterDto } from './dto/get-tickets-filter.dto';

import { User } from 'src/user/entities/user.entity';
import { ValidRoles } from 'src/user/interfaces/validRoles';
import { Equipo } from 'src/equipo/entities/equipo.entity';

@Injectable()
export class TicketService {
  private readonly logger = new Logger('TicketService');

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>
  ) {
    
  }

  async create(createTicketDto: CreateTicketDto, user: User) {
    const { equipoId, ...detallesTicket } = createTicketDto;

    // 1. Buscamos el equipo para asegurarnos de que existe
    const equipo = await this.equipoRepository.findOne({ where: { id: equipoId } });

    if (!equipo) {
      throw new NotFoundException(`Equipo con id ${equipoId} no encontrado`);
    }

    try { 
      // 2. Creamos el ticket con los detalles, asignando el equipo y el usuario
      const ticket = this.ticketRepository.create({
        ...detallesTicket,
        equipo,
        user
      });

      await this.ticketRepository.save(ticket);
      return ticket;
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error inesperado al crear el ticket. Revisa los logs del servidor.');
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
    order: { 
      createdAt: 'DESC',
      comments: {
        createdAt: 'ASC'
      }

     },
    relations: {
      user: true,
      equipo: true,
      tecnico: true,
      comments: {
        user: true
      }
    },
  });
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException(`Ticket with id ${id} not found`);
    }
    return ticket;
  }



  async update(id: string, updateTicketDto: UpdateTicketDto, user: User) {
  // 1. Buscamos el ticket. Si no existe, findOne lanzará el error 404 que ya programaste.
    const ticket = await this.findOne(id);

    const {tecnicoId, ...toUpdate} = updateTicketDto;
    //2. REGLA: Asignación de tecnico (SOLO ADMIN)
    if(tecnicoId) {
      //Si alguien que no es ADMIN intenta asignar un técnico, lo bloqueamos
      if(user.role !== ValidRoles.ADMIN) {
        throw new NotFoundException(`Solos los administradores pueden asignar técnicos a los tickets`);
      }
      const tecnico = await this.userRepository.findOneBy({id: tecnicoId});
      if(!tecnico) throw new NotFoundException(`Técnico con id ${tecnicoId} no encontrado `);

      //Verificamos que el técnico tenga el rol de técnico
      if(tecnico.role !== ValidRoles.AGENT) {
        throw new NotFoundException(`El usuario asignado debe tener el rol de técnico (AGENT)`);
      }
      ticket.tecnico = tecnico;
    }
  // 2. fusionamos los datos del DTO con el ticket encontrado
     this.ticketRepository.merge(ticket, toUpdate); 
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
