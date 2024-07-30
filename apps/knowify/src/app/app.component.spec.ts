import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoadingService } from './services/loading.service';
import { BehaviorSubject } from 'rxjs';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockLoadingService: jest.Mocked<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;
  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(true);
    mockLoadingService = {
      loading$: loadingSubject.asObservable(),
      setLoading: jest.fn((loading: boolean) => loadingSubject.next(loading)),
    } as unknown as jest.Mocked<LoadingService>;

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [{ provide: LoadingService, useValue: mockLoadingService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should have as title 'knowify'`, () => {
    expect(component.title).toEqual('knowify');
  });

  it('should have isMenuOpen initially set to false', () => {
    expect(component.isMenuOpen).toBeFalsy();
  });

  it('should toggle isMenuOpen when toggleMenu is called', () => {
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTruthy();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalsy();
  });


  it('should display loading spinner when loading$ is true', () => {
    mockLoadingService.setLoading(true);
    fixture.detectChanges();
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinnerElement).not.toBeNull();
  });

  it('should not display loading spinner when loading$ is false', () => {
    mockLoadingService.setLoading(false);
    fixture.detectChanges();
    const spinnerElement = fixture.nativeElement.querySelector('mat-spinner');
    expect(spinnerElement).toBeNull();
  });
});
