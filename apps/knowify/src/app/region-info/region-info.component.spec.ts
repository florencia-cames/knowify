import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RegionInfoComponent } from './region-info.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

describe('RegionInfoComponent', () => {
  let component: RegionInfoComponent;
  let fixture: ComponentFixture<RegionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatTooltipModule, RegionInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the region name', () => {
    // Arrange
    const regionName = 'Test Region';
    component.regionName = regionName;
    fixture.detectChanges();

    // Act
    const regionNameElement = fixture.debugElement.query(By.css('.region-item')).nativeElement;

    // Assert
    expect(regionNameElement.textContent).toContain(regionName);
  });

  it('should display the tooltip with the correct text', () => {
    // Arrange
    const tooltipText = 'This is a tooltip';
    component.tooltipText = tooltipText;
    fixture.detectChanges();

    // Act
    const matIconDebugElement = fixture.debugElement.query(By.css('mat-icon'));
    const matTooltipInstance = matIconDebugElement.injector.get(MatTooltip);

    // Assert
    expect(matTooltipInstance.message).toBe(tooltipText);
  });
});
