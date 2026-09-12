import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Equipo } from 'src/equipo/entities/equipo.entity';
import { Ticket } from 'src/ticket/entities';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comments/entities';
import { ValidRoles } from 'src/user/interfaces/validRoles';
import { TicketCategory, TicketPriority, TicketStatus } from 'src/ticket/enums';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async runSeed() {
    this.logger.log('Seeding database...');

    await this.deleteTables();

    const users = await this.insertUsers();
    const equipos = await this.insertEquipos(users);
    const tickets = await this.insertTickets(equipos, users);
    this.logger.log('Database seeding completed.');
    return { message: 'Seed ejecutado con exito. Base de datos lista.' };
  }

  private async deleteTables() {
    this.logger.log('Deleting tables...');
    //await this.ticketRepository.delete({});
    //await this.equipoRepository.delete({});
    //await this.userRepository.delete({});
    //await this.commentRepository.delete({});
    // El QueryBuilder nos permite ejecutar el borrado masivo intencionalmente                   
    await this.commentRepository.createQueryBuilder().delete().execute();   
    await this.ticketRepository.createQueryBuilder().delete().execute();                         
    await this.equipoRepository.createQueryBuilder().delete().execute();                         
    await this.userRepository.createQueryBuilder().delete().execute();
  }

  //INSERTANDO USUARIOS
  private async insertUsers() {
    this.logger.log('Insertando usuarios...');
    const seedUsers: User[] = [];
    const password = bcrypt.hashSync('Password123!', 10);

    //Administradores
    for (let i = 1; i <= 2; i++) {

        seedUsers.push( this.userRepository.create({
            email: `admin${i}@test.com`,
            password: password,
            fullname: `Admin ${i}`,
            role: ValidRoles.ADMIN,
            isActive: true,
        }),
      );
    }
    // Generar 3 Agentes
    for (let i = 1; i <= 3; i++) {

        seedUsers.push( this.userRepository.create({
            email: `agent${i}@test.com`,
            password,
            fullname: `Agente Técnico ${i}`,
            role: ValidRoles.AGENT,
            isActive: true,
        }),
      );
    }
    // Generar 10 Clientes
    for (let i = 1; i <= 10; i++) {
        seedUsers.push( this.userRepository.create({
            email: `client${i}@test.com`,
            password,
            fullname: `Cliente Funcionario ${i}`,
            role: ValidRoles.CLIENT,
            isActive: true,
        }),
      );
    }
    //Guardo todos los usuario de un golpe
    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers;
  }

  //INSERTANDO TICKETS
  private async insertTickets(equipos: Equipo[], users: User[]) {
    this.logger.log('Insertando tickets...');
    //Extraigo todos los valores de los ENUMS
    const categories = Object.values(TicketCategory);
    const priorities = Object.values(TicketPriority);

    const clients = users.filter(u => u.role === ValidRoles.CLIENT);
    const seedTickets: Ticket[] = [];

    let clientIndex = 0;
    let equipoIndex = 0;

    //Bucle anidado para cruzar cada categoria con cada prioridad
    categories.forEach(category => {
      priorities.forEach(priority => {
        
        //Tomo un cliente y equipo de forma ciclica
        const client = clients[clientIndex % clients.length];
        const equipo = equipos[equipoIndex % equipos.length];

        seedTickets.push(this.ticketRepository.create({
          title: `Ticket de prueba - ${category} - ${priority}`,
          description: `Descripcion detallada de la falla  para la categoria ${category} con prioridad ${priority}.`,
          priority,
          category,
          status: TicketStatus.ABIERTO,
          equipo,
          user: client
        }));
        clientIndex++;
        equipoIndex++;
      });
    });
    //Guardo todo el lote de tickets combinados
    await this.ticketRepository.save(seedTickets);
  }

  //INSERTANTO EQUIPOS
  private async insertEquipos(users: User[]) {
    this.logger.log('Insertando equipos...');
    const clients = users.filter((user) => user.role === ValidRoles.CLIENT);
    const seedEquipos: Equipo[] = [];

    const catalog = [
      { nombre: 'Laptop Corporativa', marca: 'Lenovo', modelo: 'ThinkPad T14' },
      { nombre: 'PC de Escritorio', marca: 'Dell', modelo: 'OptiPlex 3080' },
      {nombre: 'Impresora Multifuncional', marca: 'HP', modelo: 'LaserJet Pro' },
      { nombre: 'Router Inalámbrico', marca: 'Cisco', modelo: 'RV340' },
      { nombre: 'Monitor 24 pulgadas', marca: 'Samsung', modelo: 'F24T350F' },
      { nombre: 'Teléfono IP', marca: 'Grandstream', modelo: 'GXP1625' },
    ];
    // Le asignamos 3 equipos a cada cliente
    clients.forEach((client, clienteIndex) => {
      for (let i = 0; i < 3; i++) {
        const catalogIndex = (clienteIndex + i) % catalog.length;
        const device = catalog[catalogIndex];

        seedEquipos.push(
          this.equipoRepository.create({
            nombre: device.nombre,
            marca: device.marca,
            modelo: device.modelo,
            numeroSerie: `SN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            //numeroSerie: `SN-${device.marca.toUpperCase()}-${clienteIndex}-${i}-${Date.now()}`,
            isActive: true,
            user: client,
          }),
        );
      }
    });
    return await this.equipoRepository.save(seedEquipos);
  }
}
