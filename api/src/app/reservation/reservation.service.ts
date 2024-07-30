import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { RegionService } from '../region/region.service';
import { RestaurantAvailabilityService } from '../restaurant-availability/restaurant-availability.service';
import { Region } from '../region/region';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly regionService: RegionService,
    private readonly availabilityService: RestaurantAvailabilityService,
  ) {}

  async createReservation(reservationData: Partial<Reservation>): Promise<Reservation> {
    const reservation = this.reservationRepository.create(reservationData);
    return this.reservationRepository.save(reservation);
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async getReservationById(hashId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { hashId } });

    if (!reservation) {
      throw new NotFoundException(`Reservation not found`);
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new ForbiddenException(`Reservation is cancelled`);
    }

    // Check if the reservation date is in the past
    const reservationDate = new Date(reservation.date); // Ensure `reservation.date` is in the format that can be converted to Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to the start of the day

    if (reservationDate < today) {
      throw new ForbiddenException(`Reservation cannot be accessed. The date is in the past.`);
    }

    return reservation;
  }

  async updateReservation(hashId: string, updateData: Partial<Reservation>): Promise<Reservation> {
    await this.reservationRepository.update({ hashId }, updateData);
    return this.getReservationById(hashId);
  }

  async cancelReservation(hashId: string): Promise<void> {
    await this.reservationRepository.update({ hashId }, { status: ReservationStatus.CANCELLED });
  }

  async checkAvailability(date: string, region: string, email: string): Promise<boolean> {
    // Check if there are confirmed reservations in the specified region
    const regionAvailability = await this.reservationRepository.count({
      where: {
        date,
        region,
        status: ReservationStatus.CONFIRMED,
      },
    });

    // Check if there are confirmed reservations on the specified date for the provided email
    const emailAvailability = email
      ? await this.reservationRepository.count({
          where: {
            date,
            email,
            status: ReservationStatus.CONFIRMED,
          },
        })
      : 0;

    // If either condition is met, the slot is not available
    return regionAvailability === 0 && emailAvailability === 0;
  }

  /*async suggestAlternativeDates(
    date: string,
    region: string
  ): Promise<string[]> {
    // Encuentra todas las reservas para la región especificada
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.date')
      .where('reservation.region = :region', { region })
      .getMany();

    // Extrae las fechas y asegura que sean únicas
    const unavailableDates = new Set(reservations.map((r) => r.date));
    const alternativeDates: string[] = [];

    let currentDate = new Date(date);

    // Encuentra dos fechas alternativas que no están ocupadas
    for (let i = 1; i <= 14; i++) {
      currentDate.setDate(currentDate.getDate() + 1);
      const alternativeDate = currentDate.toISOString().split('T')[0];

      if (!unavailableDates.has(alternativeDate)) {
        alternativeDates.push(alternativeDate);
        if (alternativeDates.length === 2) break;
      }
    }

    return alternativeDates;
  }

    async suggestAlternativeDates(
        reservationData: {
          date: string;
          region: string;
          email: string;
          partySize: number;
          smoking: boolean;
          childrenCount: number;
        }
      ): Promise<{ regionId: number; date: string }[]> {
        const { date, region, email, partySize, smoking, childrenCount } = reservationData;
    
        // Obtener todas las fechas en las que el usuario tiene reservas confirmadas
        const userReservations = await this.reservationRepository.find({
          where: {
            email,
            status: ReservationStatus.CONFIRMED,
          },
        });
    
        const reservedDates = new Set(userReservations.map(r => r.date));
    
        // Obtener todas las regiones disponibles
        const regions = await this.regionService.findAll();
    
        // Obtener fechas disponibles
        const allDates = await this.availabilityService.getAvailableDates();
        
        // Filtrar fechas disponibles, excluyendo las fechas reservadas por el usuario
        const availableDates = allDates.filter(d => !reservedDates.has(d));
    
        const alternativeDates: { regionId: number; date: string }[] = [];
    
        // Verificar disponibilidad en la fecha especificada
        const availableRegion = await this.reservationRepository
          .createQueryBuilder('reservation')
          .select('reservation.region')
          .where('reservation.date = :date', { date })
          .andWhere('reservation.status = :status', { status: ReservationStatus.CONFIRMED })
          .andWhere('reservation.region <> :region', { region }) // Excluye la región original
          .getOne();
    
        if (availableRegion) {
          // Añadir la región disponible si hay una en la misma fecha
          const regionId = regions.find(r => r.name === availableRegion.region)?.id;
          if (regionId) {
            alternativeDates.push({ regionId, date });
          }
        }
    
        // Si no hay disponibilidad en la fecha actual, buscar dos fechas cercanas disponibles
        if (alternativeDates.length < 2) {
          const sortedDates = availableDates.sort((a, b) => Math.abs(new Date(date).getTime() - new Date(a).getTime()) - Math.abs(new Date(date).getTime() - new Date(b).getTime()));
    
          for (const nextDate of sortedDates) {
            if (alternativeDates.length >= 2) break;
    
            const isRegionAvailable = async (regionName: string) => {
              const region = await this.regionService.findAll().then(regions => regions.find(r => r.name === regionName));
              if (!region) return false;
              
              const isAvailable = await this.reservationRepository.count({
                where: {
                  date: nextDate,
                  region: regionName,
                  status: ReservationStatus.CONFIRMED,
                  partySize,
                  smoking,
                  childrenCount,
                },
              });
    
              return isAvailable === 0;
            };
    
            if (await isRegionAvailable(region)) {
              const regionId = (await this.regionService.findAll()).find(r => r.name === region)?.id;
              if (regionId) {
                alternativeDates.push({ regionId, date: nextDate });
              }
            } else {
              // Si la región original no está disponible, buscar en otras regiones
              for (const r of regions) {
                if (await isRegionAvailable(r.name)) {
                  alternativeDates.push({ regionId: r.id, date: nextDate });
                  break;
                }
              }
            }
          }
        }
    
        return alternativeDates;
      }*/
        async suggestAlternativeDates(
          reservationData: {
            date: string;
            region: string;
            email: string;
            partySize: number;
            smoking: boolean;
            childrenCount: number;
          }
        ): Promise<{ region: Region; date: string }[]> {
          const { date, region, email, partySize, smoking, childrenCount } = reservationData;
      
          // Obtener todas las fechas en las que el usuario tiene reservas confirmadas
          const userReservations = await this.reservationRepository.find({
            where: {
              email,
              status: ReservationStatus.CONFIRMED,
            },
          });
      
          const reservedDates = new Set(userReservations.map(r => r.date));
      
          // Obtener todas las regiones disponibles
          const regions = await this.regionService.findAll();
      
          // Obtener fechas disponibles
          const allDates = await this.availabilityService.getAvailableDates();
          
          // Filtrar fechas disponibles, excluyendo las fechas reservadas por el usuario
          const availableDates = allDates.filter(d => !reservedDates.has(d));
      
          const alternativeDates: { region: Region; date: string }[] = [];
      
          // Verificar disponibilidad en la fecha especificada
          const availableRegion = await this.reservationRepository
            .createQueryBuilder('reservation')
            .select('reservation.region')
            .where('reservation.date = :date', { date })
            .andWhere('reservation.status = :status', { status: ReservationStatus.CONFIRMED })
            .andWhere('reservation.region <> :region', { region }) // Excluye la región original
            .getOne();
      
          if (availableRegion) {
            // Añadir la región disponible si hay una en la misma fecha
            const regionData = regions.find(r => r.name === availableRegion.region);
            if (regionData) {
              alternativeDates.push({ region: regionData, date });
            }
          }
      
          // Si no hay disponibilidad en la fecha actual, buscar dos fechas cercanas disponibles
          if (alternativeDates.length < 2) {
            const sortedDates = availableDates.sort((a, b) =>
              Math.abs(new Date(date).getTime() - new Date(a).getTime()) - Math.abs(new Date(date).getTime() - new Date(b).getTime())
            );
      
            for (const nextDate of sortedDates) {
              if (alternativeDates.length >= 2) break;
      
              const isRegionAvailable = async (regionName: string) => {
                const region = regions.find(r => r.name === regionName);
                if (!region) return false;
      
                const isAvailable = await this.reservationRepository.count({
                  where: {
                    date: nextDate,
                    region: regionName,
                    status: ReservationStatus.CONFIRMED,
                    partySize,
                    smoking,
                    childrenCount,
                  },
                });
      
                return isAvailable === 0;
              };
      
              if (await isRegionAvailable(region)) {
                const regionData = regions.find(r => r.name === region);
                if (regionData) {
                  alternativeDates.push({ region: regionData, date: nextDate });
                }
              } else {
                // Si la región original no está disponible, buscar en otras regiones
                for (const r of regions) {
                  if (await isRegionAvailable(r.name)) {
                    alternativeDates.push({ region: r, date: nextDate });
                    break;
                  }
                }
              }
            }
          }
      
          return alternativeDates;
        }
   
      
}


/*import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>
  ) {}

  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        email: data.email,
        date: data.date,
      },
    });

    if (existingReservation) {
      throw new ConflictException(
        'You already have a reservation for this date.'
      );
    }

    const reservation = this.reservationsRepository.create(data);
    return this.reservationsRepository.save(reservation);
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservationsRepository.find();
  }

  async getReservationById(hashId: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOneBy({ hashId });
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${hashId} not found`);
    }
    return reservation;
  }

  async updateReservation(
    hashId: string,
    updateData: Partial<Reservation>
  ): Promise<Reservation> {
    const reservation = await this.getReservationById(hashId);

    if (updateData.pendingConfirmation !== undefined) {
      reservation.pendingConfirmation = updateData.pendingConfirmation;
    }

    return this.reservationsRepository.save(reservation);
  }

  async checkAvailability(
    date: string,
    region: string,
    pendingConfirmation: string
  ): Promise<boolean> {
    const isPendingConfirmation = JSON.parse(pendingConfirmation.toLowerCase());
    const reservations = await this.reservationsRepository.find({
      where: {
        date,
        region,
        pendingConfirmation: isPendingConfirmation,
      },
    });
    return reservations.length === 0;
  }

  async suggestAlternativeDates(
    date: string,
    region: string
  ): Promise<string[]> {
    // Encuentra todas las reservas para la región especificada
    const reservations = await this.reservationsRepository
      .createQueryBuilder('reservation')
      .select('reservation.date')
      .where('reservation.region = :region', { region })
      .getMany();

    // Extrae las fechas y asegura que sean únicas
    const unavailableDates = new Set(reservations.map((r) => r.date));
    const alternativeDates: string[] = [];

    let currentDate = new Date(date);

    // Encuentra dos fechas alternativas que no están ocupadas
    for (let i = 1; i <= 14; i++) {
      currentDate.setDate(currentDate.getDate() + 1);
      const alternativeDate = currentDate.toISOString().split('T')[0];

      if (!unavailableDates.has(alternativeDate)) {
        alternativeDates.push(alternativeDate);
        if (alternativeDates.length === 2) break;
      }
    }

    return alternativeDates;
  }


  async deleteReservation(hashId: string): Promise<void> {
    const result = await this.reservationsRepository.delete({ hashId });

    if (result.affected === 0) {
      // If no rows were affected, throw a NotFoundException
      throw new NotFoundException(`Reservation with ID ${hashId} not found`);
    }
  }
}*/
