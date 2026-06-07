import { Ticket } from 'src/ticket/entities';
import { User } from 'src/user/entities/user.entity';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  message: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // Relación 1: Quién escribió el comentario
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  // Relación 2: A qué ticket pertenece
  @ManyToOne(() => Ticket, (ticket) => ticket.comments)
  ticket: Ticket;

      @BeforeInsert()
      setCreatedAt() {
          this.createdAt = new Date();
      }
}
