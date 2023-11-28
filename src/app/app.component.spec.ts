import { TuiModule } from './tui.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'firebase/auth';
import { AppRoutingModule } from './app-routing.module';

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
            provideFirebaseApp(() => initializeApp(environment.firebase)), 
            provideFirestore(() => getFirestore()),
            AppRoutingModule,
            TuiModule],
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
