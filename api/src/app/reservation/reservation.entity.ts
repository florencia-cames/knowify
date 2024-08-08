import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum ReservationStatus {
  PENDING = 1,
  CONFIRMED = 2,
  CANCELLED = 3,
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  partySize: number;

  @Column()
  childrenCount: number;

  @Column()
  smoking: boolean;

  @Column()
  birthday: boolean;

  @Column({ nullable: true })
  birthdayName?: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  region: number;

  @Column({ type: 'int', default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Column()
  hashId: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateHashId() {
    this.hashId = uuidv4();
  }
}
