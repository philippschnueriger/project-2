import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { of } from 'rxjs';
import { User } from 'firebase/auth';
import { AppModule } from 'src/app/app.module';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authServiceMock: Partial<AuthService>;
  let firestoreServiceMock: Partial<FirestoreService>;

  beforeEach(async () => {
    authServiceMock = {
      user$: of({ uid: 'mockUid123', email: 'test@example.com' } as User) // Mocking a user
    };

    firestoreServiceMock = {
      userData$: of({ name: 'Test User', state: 'Test State', country: 'Test Country' }), // Mocking userData$
      saveUserData: jasmine.createSpy('saveUserData').and.returnValue(Promise.resolve()),
      getUserData: jasmine.createSpy('getUserData').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [ReactiveFormsModule, AppModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FirestoreService, useValue: firestoreServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on initialization', async () => {
    expect(component.user).toEqual({ uid: 'mockUid123', email: 'test@example.com' } as User);
    expect(firestoreServiceMock.getUserData).toHaveBeenCalledWith('mockUid123');
    await fixture.whenStable();
    expect(component.name).toBe('Test User');
    expect(component.state).toBe('Test State');
    expect(component.country).toBe('Test Country');
  });

  it('should save user data on form submission', async () => {
    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
    saveButton.click();
    expect(component.name).toBe(null);
    expect(component.state).toBe(null);
    expect(component.country).toBe(null);
    expect(firestoreServiceMock.saveUserData).toHaveBeenCalledWith('mockUid123', { name: null, state: null, country: null });
    expect(firestoreServiceMock.getUserData).toHaveBeenCalledWith('mockUid123');
    await fixture.whenStable();
    expect(component.name).toBe('Test User');
    expect(component.state).toBe('Test State');
    expect(component.country).toBe('Test Country');
  });
});
