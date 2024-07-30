// src/restaurant-availability/restaurant-availability.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantAvailability } from './restaurant-availability.entity';

@Injectable()
export class RestaurantAvailabilityService implements OnModuleInit {
  private readonly initialDays = 7;

  constructor(
    @InjectRepository(RestaurantAvailability)
    private readonly availabilityRepository: Repository<RestaurantAvailability>
  ) {}

  async onModuleInit() {
    await this.initializeAvailability();
  }

  async initializeAvailability(): Promise<void> {
    const today = new Date();
    const startDate = new Date(today.setDate(today.getDate() + 1)); // Start from tomorrow
    const dates = [];

    for (let i = 0; i < this.initialDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Format to YYYY-MM-DD
    }

    for (const date of dates) {
      const existingDate = await this.availabilityRepository.findOneBy({ date });
      if (!existingDate) {
        await this.addAvailableSlots(date);
      }
    }
  }

  private async addAvailableSlots(date: string): Promise<void> {
    const timeSlots = this.generateTimeSlots();
    for (const timeSlot of timeSlots) {
      const availability = new RestaurantAvailability();
      availability.date = date;
      availability.timeSlot = timeSlot;
      availability.isAvailable = true; // Assume all slots are available initially
      await this.availabilityRepository.save(availability);
    }
  }

  private generateTimeSlots(): string[] {
    const slots = [];
    // Genera franjas horarias desde las 18:00 hasta las 22:00
    for (let hour = 18; hour <= 22; hour++) {
      slots.push(`${hour}:00`);
      // Solo añade '30' si la hora actual no es la última (22:00)
      if (hour < 22) {
        slots.push(`${hour}:30`);
      }
    }
    return slots;
  }

  async getAvailableDates(): Promise<string[]> {
    const rawDates = await this.availabilityRepository.query(`
      SELECT DISTINCT date
      FROM restaurant_availability
      WHERE isAvailable = true
    `);
    return rawDates.map(record => record.date);
  }

  async getAvailableSlots(): Promise<string[]> {
    const availabilities = await this.availabilityRepository.find({
      where: { isAvailable: true },
      select: ['timeSlot'],
    });
  
    const uniqueSlots = Array.from(new Set(availabilities.map(a => a.timeSlot)));
    
    return uniqueSlots;
  }
}
