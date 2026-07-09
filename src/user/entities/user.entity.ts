import { Comment } from 'src/comments/entities';
import { Equipo } from 'src/equipo/entities/equipo.entity';
import { Ticket } from 'src/ticket/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    email: string;
    
    @Column('text',{ select: false })
    password?: string;
    
    @Column('text')
    fullname: string;
    
    @Column('bool', {
        default: true
    })
    isActive: boolean;
    
    @Column('text', {
        default: 'client'
    })
    role: string;

    // Un tecnico -> Muchos tickets
    @OneToMany(
        () => Ticket,
        (ticket) => ticket.tecnico,
        { eager: false }
    )
    ticketsAsigned: Ticket[];

    // Un usuario -> Muchos tickets
    @OneToMany(
        () => Ticket,
        (ticket) => ticket.user,
        { eager: false }
    )
    ticketsCreated: Ticket[];

    // Un usuario -> Muchos comentarios
    @OneToMany(
        () => Comment,
        (comment) => comment.user
    )
    comments: Comment[];

    // Un usuario -> Muchos equipos
    @OneToMany(
        () => Equipo,
        (equipo) => equipo.user
    )
    equipos: Equipo[];
}
