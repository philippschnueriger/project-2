import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PopularDestinationsComponent } from './popular-destinations.component';
import { ApiService } from '../../../services/api.service';
import { of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { TuiDay } from '@taiga-ui/cdk';
import { Router } from '@angular/router';

describe('PopularDestinationsComponent', () => {
  let component: PopularDestinationsComponent;
  let fixture: ComponentFixture<PopularDestinationsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: Router;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getLocationId']);

    await TestBed.configureTestingModule({
      declarations: [PopularDestinationsComponent],
      imports: [RouterTestingModule, AppModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router);

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to destination', async () => {
    const mockLocationId = 'mockedId';
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    const queryParams = {
      cityFrom: 'ZRH',
      cityTo: mockLocationId,
      departureDate: nextWeek.toString().replace(/\./g, '/'),
    };

    spyOn(router, 'navigate').and.stub();
    apiService.getLocationId.and.returnValue(of({ locations: [{ id: mockLocationId }] }));

    await component.exploreDestination('London');

    expect(apiService.getLocationId).toHaveBeenCalledWith('London');
    expect(router.navigate).toHaveBeenCalledWith(['/results'], { queryParams });
  });

  it('should handle error while getting location ID', async () => {
    spyOn(console, 'error');
    spyOn(router, 'navigate').and.stub();
    apiService.getLocationId.and.throwError('Some error');

    await component.exploreDestination('London');

    expect(console.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  });
});
