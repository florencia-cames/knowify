import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * Formats a given date into a string with the format YYYY-MM-DD.
   *
   * This method converts the provided `Date` object into a string representation
   * with the year, month, and day, ensuring each component is two digits.
   *
   * Example:
   * - For a date of `March 8, 2024`, the output will be `"2024-03-08"`.
   *
   * @param {Date} date - The date to be formatted.
   * @returns {string} A string representing the date in the format `YYYY-MM-DD`.
   */
  public formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a given date into a string with the format YYYY-MM-DD.
   *
   * This method converts the provided `Date` object into a string representation
   * with the year, month, and day, ensuring each component is two digits.
   *
   * Example:
   * - For a date of `March 8, 2024`, the output will be `"2024-03-08"`.
   *
   * @param {Date} date - The date to be formatted.
   * @returns {string} A string representing the date in the format `YYYY-MM-DD`.
   */
  public formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0-11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
