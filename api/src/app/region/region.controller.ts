// src/regions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { Region } from './region';

@Controller('region')
export class RegionController {
  constructor(private readonly regionsService: RegionService) {}

  /**
   * Retrieves all regions from the database.
   *
   * This endpoint returns an array of `Region` objects representing all the regions
   * stored in the database.
   *
   * @returns {Promise<Region[]>} An array of `Region` entities.
   * @memberof RegionController
   */
  @Get()
  findAll(): Promise<Region[]> {
    return this.regionsService.findAll();
  }

  /**
   * Retrieves a single region by its ID.
   *
   * This endpoint returns a `Region` object for the specified ID from the database.
   *
   * @param {number} id - The ID of the region to retrieve.
   * @returns {Promise<Region>} The `Region` entity with the specified ID.
   * @memberof RegionController
   */
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Region> {
    return this.regionsService.findOne(id);
  }
}
