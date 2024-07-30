import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfirmationComponent } from './confirmation.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CancelButtonDirective } from '../../directives/cancel-button-directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let mockRouter: Router;
  let mockActivatedRoute: ActivatedRoute;


  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as unknown as Router;

    mockActivatedRoute = {
      data: of({data: { reservation: null, region: { id: 1, name: 'Mock Region' } }}),
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, CancelButtonDirective, ConfirmationComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display reservation confirmation message', () => {
    // Arrange
    fixture.detectChanges();

    // Act
    const headingElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    const paragraphElement = fixture.debugElement.query(By.css('p')).nativeElement;
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;

    // Assert
    expect(headingElement.textContent).toBe('Reservation Confirmation');
    expect(paragraphElement.textContent).toContain('Thank you for booking with us, we look forward to seeing you on the specified date and time.');
    expect(buttonElement.textContent).toBe(' Cancel ');
  });

  it('should navigate to reservations if no reservation data is provided', () => {
    // Arrange
    jest.spyOn(mockRouter, 'navigate');
    mockActivatedRoute.data = of({data: { reservation: null, region: null }}); // Simulate no data

    // Act
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/reservations']);
  });
});
