import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    authServiceMock = {
      user$: of(null),
      signUp: jasmine.createSpy('signUp').and.returnValue(Promise.resolve()),
      login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
      logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve())
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        AppModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to favourites after successful signup', async () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    await component.signUp('test@example.com', 'password');
    expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', 'password');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/favourites']);
    expect(component.error).toBeNull();
  });

  it('should set error message for email already in use during signup', async () => {
    authServiceMock.signUp = jasmine.createSpy('signUp').and.returnValue(Promise.reject('Firebase: Error (auth/email-already-in-use).'));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    await component.signUp('test@example.com', 'password');
    expect(authServiceMock.signUp).toHaveBeenCalledWith('test@example.com', 'password');
    expect(component.error).toBe('Email already in use');
  });
});
