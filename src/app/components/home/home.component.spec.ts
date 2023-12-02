import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TuiDay } from '@taiga-ui/cdk';
import { AppModule } from 'src/app/app.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [ RouterTestingModule, AppModule ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate when exploreDestinations is called', () => {
    const nextWeek = TuiDay.currentLocal().append({ day: 7 });
    component.exploreDestinations();

    expect(router.navigate).toHaveBeenCalledWith(['/results'], {
      queryParams: {
        cityFrom: 'ZRH',
        departureDate: nextWeek.toString().replace(/\./g, '/'),
      },
    });
  });
});
