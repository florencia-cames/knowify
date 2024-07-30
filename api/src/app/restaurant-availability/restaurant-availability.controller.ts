import { Controller, Get } from '@nestjs/common';
import { RestaurantAvailabilityService } from './restaurant-availability.service';

@Controller('availability')
export class RestaurantAvailabilityController {
  constructor(private readonly availabilityService: RestaurantAvailabilityService) {}

  /**
   * Retrieves available dates from the service.
   * 
   * @returns {Promise<string[]>} An array of available dates in 'YYYY-MM-DD' format.
   */
  @Get('dates')
  async getAvailableDates(): Promise<string[]> {
    return this.availabilityService.getAvailableDates();
  }

  @Get('times')
  async getAvailableTimes(): Promise<string[]> {
    return this.availabilityService.getAvailableSlots();
  }
}
