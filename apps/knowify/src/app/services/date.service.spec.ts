import { DateService } from "./dates.services";


describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    service = new DateService();
  });

  it('should format date to YYYY-MM-DD correctly', () => {
    const date = new Date(2024, 2, 8);
    const expected = '2024-03-08';
    const result = service.formatDate(date);
    expect(result).toBe(expected);
  });

  it('should format date to YYYY-MM-DD correctly using formatDateToYYYYMMDD', () => {
    const date = new Date(2024, 2, 8); // March 8, 2024
    const expected = '2024-03-08';
    const result = service.formatDateToYYYYMMDD(date);
    expect(result).toBe(expected);
  });
});
