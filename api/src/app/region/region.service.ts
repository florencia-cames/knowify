// src/region.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './region';

@Injectable()
export class RegionService implements OnModuleInit {
  constructor(
    @InjectRepository(Region)
    private regionsRepository: Repository<Region>,
  ) {}

  async onModuleInit() {
    const initialRegions = [
      {
        name: 'Main Hall',
        seatingCapacity: 12,
        childrenAllowed: true,
        smokingAllowed: false,
      },
      {
        name: 'Bar',
        seatingCapacity: 4,
        childrenAllowed: false,
        smokingAllowed: false,
      },
      {
        name: 'Riverside',
        seatingCapacity: 8,
        childrenAllowed: true,
        smokingAllowed: false,
      },
      {
        name: 'Riverside (smoking allowed)',
        seatingCapacity: 6,
        childrenAllowed: false,
        smokingAllowed: true,
      },
      {
        name: 'Bowery',
        seatingCapacity: 10,
        childrenAllowed: false,
        smokingAllowed: true,
      },
    ];

    for (const region of initialRegions) {
      const existingRegion = await this.regionsRepository.findOneBy({ name: region.name });
      if (!existingRegion) {
        await this.regionsRepository.save(region);
      }
    }
  }

  /**
   * Retrieves all regions from the database.
   * 
   * This method fetches all `Region` entities stored in the database and returns
   * them as an array.
   * 
   * @returns {Promise<Region[]>} A promise that resolves to an array of `Region` entities.
   * @memberof RegionService
   */
  findAll(): Promise<Region[]> {
    return this.regionsRepository.find();
  }

   /**
   * Retrieves a single region by its ID.
   * 
   * This method fetches a `Region` entity with the specified ID from the database.
   * If no region is found with the given ID, the result will be `null`.
   * 
   * @param {number} id - The ID of the region to retrieve.
   * @returns {Promise<Region>} A promise that resolves to the `Region` entity with the specified ID,
   *                            or `null` if no region is found.
   * @memberof RegionService
   */
  findOne(id: number): Promise<Region> {
    return this.regionsRepository.findOneBy({ id });
  }
}
