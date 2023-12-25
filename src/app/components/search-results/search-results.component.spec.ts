import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ResultsComponent } from './search-results.component';
import { SearchFormComponent } from '../search-form/search-form.component';
import * as data from 'src/app/data/mock-data.json';
import { AppModule } from '../../app.module';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    // Create a mock ApiService with a spy
    mockApiService = jasmine.createSpyObj('ApiService', ['getData']);

    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [ResultsComponent, SearchFormComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              cityFrom: 'New York',
              cityTo: 'SomeDestination',
              departureDate: '2023-12-01',
            })
          }
        },
        { provide: ApiService, useValue: mockApiService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from ApiService', async () => {
    const fakeData = {
      data: [data]
    };
    console.log(data)
    mockApiService.getData.and.returnValue(of(fakeData));

    await component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.data.length).toBe(fakeData.data.length);
  });
});
