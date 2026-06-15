import { Ticket } from "src/ticket/entities";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('equipos')
export class Equipo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    marca: string;

    @Column('text')
    modelo: string;

    @Column('text', { unique: true })
    numeroSerie: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    //TODO: Relación con Ticket
    // Un equipo puede tener muchos tickets
    @OneToMany(
        () => Ticket,
        (ticket) => ticket.equipo,
    )
    tickets: Ticket[];

    //un equipo pertence a un funcionario (usuario)
    @ManyToOne(
        () => User,
        (user) => user.equipos,
        { eager: false }
    )
    user: User;


}
