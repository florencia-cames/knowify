export interface ReservationSlot {
  date: Date;
  slots: Date[];
}

export interface Region {
  id: number;
  name: string;
  seatingCapacity: number;
  childrenAllowed: boolean;
  smokingAllowed: boolean;
}

export interface Reservation {
  id: number;
  hashId: string;
  status: ReservationStatus;
  name: string;
  email: string;
  phoneNumber: string;
  partySize: number;
  childrenCount: number;
  smoking: boolean;
  birthday?: boolean;
  birthdayName?: string;
  date: string;
  time: string;
  region: number;
}

export enum ReservationStatus {
  PENDING = 1,
  CONFIRMED = 2,
  CANCELLED = 3,
}

export interface SuggestionResponse {
  region: Region;
  date: string;
}
