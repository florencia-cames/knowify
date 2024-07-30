import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { RestaurantAvailabilityModule } from '../restaurant-availability/restaurant-availability.module';
import { RegionModule } from '../region/region.module';


@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), RestaurantAvailabilityModule, RegionModule],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
