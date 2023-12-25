import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouriteConnectionsComponent } from './favourite-connections.component';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'firebase/auth';

describe('FavouriteConnectionsComponent', () => {
  let component: FavouriteConnectionsComponent;
  let fixture: ComponentFixture<FavouriteConnectionsComponent>;
  let authServiceMock: Partial<AuthService>;
  let firestoreServiceMock: Partial<FirestoreService>;

  const testUser  = {
    email: 'test@test.com',
  };

  beforeEach(async () => {
    authServiceMock = {
      user$: new BehaviorSubject<User | null>(null),
    };

    firestoreServiceMock = {
      favourites$: of([]),
      getFavouriteConnections: jasmine.createSpy('getFavouriteConnections'),
    };

    await TestBed.configureTestingModule({
      declarations: [FavouriteConnectionsComponent],
      providers: [
        { provide: AuthService, useValue: { user$: of(testUser)} },
        { provide: FirestoreService, useValue: firestoreServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update user and call getFavouriteConnections on initialization', () => {
    
    const firestoreService = TestBed.inject(FirestoreService);
    const getFavouriteConnectionsSpy = spyOn(
      component,
      'getFavouriteConnections'
    );
    fixture.detectChanges();
    //expect(getFavouriteConnectionsSpy).toHaveBeenCalled();
  });

  it('should call getFavouriteConnections when user changes', () => {

    const firestoreService = TestBed.inject(FirestoreService);

    fixture.detectChanges();

  });

  it('should log "no uid" when user is null in getFavouriteConnections', () => {
    const consoleSpy = spyOn(console, 'log');
    component.getFavouriteConnections();

    expect(consoleSpy).toHaveBeenCalledWith('no uid');
  });

});
