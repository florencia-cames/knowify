import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './region/region';
import { RegionModule } from './region/region.module';
import { RestaurantAvailabilityModule } from './restaurant-availability/restaurant-availability.module';
import { RestaurantAvailability } from './restaurant-availability/restaurant-availability.entity';

import { ReservationModule } from './reservation/reservation.module';
import { Reservation } from './reservation/reservation.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Region, RestaurantAvailability, Reservation],
      synchronize: true,  // Solo para desarrollo. No usar en producción.
    }),
    TypeOrmModule.forFeature([Region, RestaurantAvailability, Reservation]),
    RegionModule,
    RestaurantAvailabilityModule,
    ReservationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
