import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Equipo } from "src/equipo/entities/equipo.entity";
import { TicketPriority, TicketCategory, TicketStatus } from "../enums";


@Entity('tickets')

export class Ticket {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    title: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    description: string;
    
    @Column(
        {
            type: 'enum',
            enum: TicketPriority,
            default: TicketPriority.BAJA
        }
    )
    priority: TicketPriority;
    
    @Column( {
        type: 'enum',
        enum: TicketCategory,
        default: TicketCategory.FALLA_RED
    })
    categoria: TicketCategory;
    
    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.ABIERTO
    })
    status: TicketStatus;
    

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true,
        default: null,
    })
    updatedAt: Date | null;
    

    // Un ticket -> Muchos comentarios
    @OneToMany(
        () => Comment,
        (comment) => comment.ticket
    )
    comments?: Comment[];

    // Un ticket -> Un técnico
    @ManyToOne(
        () => User,
        (tecnico) => tecnico.ticketsAsigned,
        { eager: false }
    )
    tecnico?: User;

    // Un ticket -> Un usuario (cliente)
    @ManyToOne(
        () => User,
        (user) => user.ticketsCreated,
        { eager: true }
    )
    user: User;

    // Un ticket -> Un equipo
    @ManyToOne(
        () => Equipo,
        (equipo) => equipo.tickets,
        { eager: true }
    )
    equipo: Equipo;

  
    
    @BeforeInsert()
    setCreatedAt() {
        this.createdAt = new Date();
        this.updatedAt = null;
    }


}
