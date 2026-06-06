import { Comment } from 'src/comments/entities';
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
    
    @Column('text', {
        select: false
    })
    password: string;
    
    @Column('text')
    fullname: string;
    
    @Column('bool', {
        default: true
    })
    isActive: boolean;
    
    @Column('text', {
        array: true,
        default: ['client']
    })
    roles: string[];

    @OneToMany(
        () => Ticket,
        (ticket) => ticket.user,
        { eager: false }
    )
    tickets: Ticket[];

    // Un usuario -> Muchos comentarios
    @OneToMany(
        () => Comment,
        (comment) => comment.user
    )
    comments: Comment[];
}
