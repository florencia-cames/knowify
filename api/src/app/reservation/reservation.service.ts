import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { RegionService } from '../region/region.service';
import { RestaurantAvailabilityService } from '../restaurant-availability/restaurant-availability.service';
import { Region } from '../region/region';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly regionService: RegionService,
    private readonly availabilityService: RestaurantAvailabilityService
  ) {}

  async onModuleInit() {
    await this.insertMultipleReservations();
  }

  async insertMultipleReservations(): Promise<void> {
    const startDate = new Date('2024-07-31'); // Fecha de inicio
    const reservations = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i); // Incrementa la fecha por 1 día en cada iteración

      const reservation = {
        name: 'Flor',
        email: `flor${i}@gmail.com`,
        phoneNumber: '1234567890',
        partySize: 4,
        childrenCount: 0,
        smoking: false,
        birthday: false,
        birthdayName: '',
        date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
        time: '20:00',
        region: 2,
        status: ReservationStatus.CONFIRMED,
        hashId: uuidv4(), // Generar un hashId único para cada reserva
        createdAt: new Date().toISOString(), // Fecha y hora actuales
      };

      reservations.push(reservation);
    }

    // Inserta todas las reservas en la base de datos
    await this.reservationRepository.save(reservations);
  }

  async createReservation(
    reservationData: Partial<Reservation>
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create(reservationData);
    return this.reservationRepository.save(reservation);
  }

  async getReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async getReservationById(hashId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { hashId },
    });

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
      throw new ForbiddenException(
        `Reservation cannot be accessed. The date is in the past.`
      );
    }

    return reservation;
  }

  async updateReservation(
    hashId: string,
    updateData: Partial<Reservation>
  ): Promise<Reservation> {
    await this.reservationRepository.update({ hashId }, updateData);
    return this.getReservationById(hashId);
  }

  async cancelReservation(hashId: string): Promise<void> {
    await this.reservationRepository.update(
      { hashId },
      { status: ReservationStatus.CANCELLED }
    );
  }

  async checkAvailability(
    date: string,
    region: number,
    email: string
  ): Promise<boolean> {
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

  async suggestAlternativeDates(reservationData: {
    date: string;
    region: string;
    email: string;
    partySize: number;
    smoking: boolean;
    childrenCount: number;
  }): Promise<{ region: Region; date: string }[]> {
    const { date, region, email, partySize, smoking, childrenCount } =
      reservationData;

    // Obtener todas las fechas en las que el usuario tiene reservas confirmadas
    const userReservations = await this.reservationRepository.find({
      where: {
        email,
        status: ReservationStatus.CONFIRMED,
      },
    });

    const reservedDates = new Set(userReservations.map((r) => r.date));

    // Obtener todas las regiones disponibles
    const regions = await this.regionService.findAll();

    // Obtener fechas disponibles
    const allDates = await this.availabilityService.getAvailableDates();

    // Filtrar fechas disponibles, excluyendo las fechas reservadas por el usuario
    const availableDates = allDates.filter((d) => !reservedDates.has(d));

    const alternativeDates: { region: Region; date: string }[] = [];

    const availableRegion = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.region')
      .where('reservation.date = :date', { date })
      .andWhere('reservation.status = :status', {
        status: ReservationStatus.CONFIRMED,
      })
      .andWhere('reservation.region <> :region', { region })
      .getOne();

    if (availableRegion) {
      const regionData = regions.find((r) => r.id === availableRegion.region);
      if (regionData) {
        alternativeDates.push({ region: regionData, date });
      }
    }

    if (alternativeDates.length < 2) {
      const sortedDates = availableDates.sort(
        (a, b) =>
          Math.abs(new Date(date).getTime() - new Date(a).getTime()) -
          Math.abs(new Date(date).getTime() - new Date(b).getTime())
      );

      for (const nextDate of sortedDates) {
        if (alternativeDates.length >= 2) break;

        const isRegionAvailable = async (regionName: string) => {
          const region = regions.find((r) => r.name === regionName);
          if (!region) return false;

          const isAvailable = await this.reservationRepository.count({
            where: {
              date: nextDate,
              region: region.id,
              status: ReservationStatus.CONFIRMED,
              partySize,
              smoking,
              childrenCount,
            },
          });

          return isAvailable === 0;
        };

        if (await isRegionAvailable(region)) {
          const regionData = regions.find((r) => r.name === region);
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

    if (alternativeDates.length === 0) {
      throw new NotFoundException(`We are sorry to inform that the region is not available and the are no other suggestions.`);
    }

    return alternativeDates;
  }
}
