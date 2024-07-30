import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestaurantAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  timeSlot: string;

  @Column({ default: true })
  isAvailable: boolean;
}
