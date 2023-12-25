import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFormComponent } from './search-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let apiServiceMock: Partial<ApiService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    apiServiceMock = {
      getLocationId: jasmine.createSpy('getLocationId').and.returnValue(of({ locations: [{ id: '123' }] }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [SearchFormComponent],
      imports: [
        ReactiveFormsModule,
        AppModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
