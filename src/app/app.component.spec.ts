import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject} from 'rxjs';
import { User } from 'firebase/auth';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async () => {
    authServiceStub = {
      user$: new BehaviorSubject<User | null>(null)
    };

    await TestBed.configureTestingModule({
        imports: [
          AppModule
            ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mobileNavOpen when toggleNav() is called', () => {
    expect(component.mobileNavOpen).toBeFalse();
    component.toggleNav();
    expect(component.mobileNavOpen).toBeTrue();
    component.toggleNav();
    expect(component.mobileNavOpen).toBeFalse();
  });

  it('should display logo and "TripSearch" text', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.logo')).toBeTruthy();
    expect(compiled.querySelector('.logo img').getAttribute('src')).toContain('assets/logo/logo.svg');
    expect(compiled.querySelector('.logo div').textContent).toContain('TripSearch');
  });

});
