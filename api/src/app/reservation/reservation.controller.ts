import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';
import { Region } from '../region/region';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() reservationData: Partial<Reservation>): Promise<Reservation> {
    return this.reservationService.createReservation(reservationData);
  }

  @Get()
  async getReservations(): Promise<Reservation[]> {
    return this.reservationService.getReservations();
  }

  @Get('reservation/:hashId')
  async getReservationById(@Param('hashId') hashId: string): Promise<Reservation> {
    return this.reservationService.getReservationById(hashId);
  }

  @Patch('reservation/:hashId')
  async updateReservation(
    @Param('hashId') hashId: string,
    @Body() updateData: Partial<Reservation>
  ): Promise<Reservation> {
    return this.reservationService.updateReservation(hashId, updateData);
  }

  @Patch('cancel/:hashId')
  async cancelReservation(@Param('hashId') hashId: string): Promise<void> {
    await this.reservationService.cancelReservation(hashId);
  }

  @Get('availability')
  async checkAvailability(
    @Query('date') date: string,
    @Query('region') region: number,
    @Query('email') email: string
  ): Promise<boolean> {
    return this.reservationService.checkAvailability(date, region, email);
  }

  @Post('suggest-alternatives')
  async suggestAlternativeDates(
    @Body() reservationData: {
      date: string;
      region: string;
      email: string;
      partySize: number;
      smoking: boolean;
      childrenCount: number;
    }
  ): Promise<{ region: Region; date: string }[]> {
    return this.reservationService.suggestAlternativeDates(reservationData);
  }
/*
  @Get('suggest')
  async suggestAlternativeDates(
    @Query('date') date: string,
    @Query('region') region: string
  ): Promise<string[]> {
    return this.reservationService.suggestAlternativeDates(date, region);
  }*/
}




/*import { Controller, Post, Body, Get, Param, Patch, Query, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.entity';



@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() reservationData: Partial<Reservation>): Promise<Reservation> {
    return this.reservationService.createReservation(reservationData);
  }

  @Get()
  async getReservations(): Promise<Reservation[]> {
    return this.reservationService.getReservations();
  }

  @Get('reservation/:hashId')
  async getReservationById(@Param('hashId') hashId: string): Promise<Reservation> {
    return this.reservationService.getReservationById(hashId);
  }

  @Patch('reservation/:hashId')
  async updateReservation(
    @Param('hashId') hashId: string,
    @Body() updateData: Partial<Reservation>
  ): Promise<Reservation> {
    return this.reservationService.updateReservation(hashId, updateData);
  }

  @Delete('delete/:hashId')
  async deleteReservation(@Param('hashId') hashId: string): Promise<void> {
    await this.reservationService.deleteReservation(hashId);
  }


  @Get('availability')
  async checkAvailability(
    @Query('date') date: string,
    @Query('region') region: string,
    @Query('pendingConfirmation') pendingConfirmation: string
  ): Promise<boolean> {
    return this.reservationService.checkAvailability(date, region, pendingConfirmation);
  }

  @Get('suggest')
  async suggestAlternativeDates(
    @Query('date') date: string,
    @Query('region') region: string
  ): Promise<string[]> {
    return this.reservationService.suggestAlternativeDates(date, region);
  }
}*/
