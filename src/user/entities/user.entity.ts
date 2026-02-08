import { Comment } from 'src/comments/entities/comment.entity';
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
    
    @Column('text')
    password: string;
    
    @Column('text')
    fullname: string;
    
    @Column('bool')
    isActive: boolean=true;
    
    @Column('text', {
        array: true,
        default: ['cliente']
    })
    roles: string[]= ['cliente'];

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
