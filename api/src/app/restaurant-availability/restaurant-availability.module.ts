import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantAvailability } from './restaurant-availability.entity';
import { RestaurantAvailabilityController } from './restaurant-availability.controller';
import { RestaurantAvailabilityService } from './restaurant-availability.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantAvailability])],
  controllers: [RestaurantAvailabilityController],
  providers: [RestaurantAvailabilityService],
  exports: [RestaurantAvailabilityService],
})
export class RestaurantAvailabilityModule {}
