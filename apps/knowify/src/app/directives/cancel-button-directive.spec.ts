import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CancelButtonDirective } from './cancel-button-directive';
import { ReservationService } from '../reservation/reservation.service';
import { Component } from '@angular/core';
import { Reservation } from '../reservation/reservation.interfaces';

// Crear un componente de prueba que usará la directiva
@Component({
  template: `<button appCancelButton [appCancelButton]="reservation">Cancel</button>`
})
class TestComponent {
  public reservation: Partial<Reservation> | null = { hashId: 'test-hash-id' };
}

describe('CancelButtonDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveEl: HTMLElement;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const reservationServiceMock = {
      cancelReservation: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CancelButtonDirective],
      declarations:[TestComponent],
      providers: [
        { provide: ReservationService, useValue: reservationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    directiveEl = fixture.debugElement.query(By.directive(CancelButtonDirective))?.nativeElement;
    reservationService = TestBed.inject(ReservationService);
  });

  it('should call cancelReservation when clicked', () => {
    // Act
    directiveEl.click();

    // Assert
    expect(reservationService.cancelReservation).toHaveBeenCalledWith('test-hash-id');
  });

  it('should not call cancelReservation if reservation is not defined', () => {
    // Arrange
    fixture.componentInstance.reservation = null;
    fixture.detectChanges();

    // Act
    directiveEl.click();

    // Assert
    expect(reservationService.cancelReservation).not.toHaveBeenCalled();
  });
});
