import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionCardComponent } from './connection-card.component';
import { TripSegment } from '../../../types/tripSegment';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';
import { ApiService } from '../../../services/api.service';
import { of } from 'rxjs';
import { User } from 'firebase/auth';
import { AppModule } from 'src/app/app.module';

describe('ConnectionCardComponent', () => {
  let component: ConnectionCardComponent;
  let fixture: ComponentFixture<ConnectionCardComponent>;
  let authServiceMock: Partial<AuthService>;
  let firestoreServiceMock: Partial<FirestoreService>;
  let apiServiceMock: Partial<ApiService>;

  beforeEach(async () => {
    authServiceMock = {
      user$: of({ uid: 'mockUid123', email: 'test@example.com' } as User), // Mocking a user
    };

    firestoreServiceMock = {
      saveFavouriteConnection: jasmine.createSpy('saveFavouriteConnection'),
      deleteFavouriteConnection: jasmine.createSpy('deleteFavouriteConnection'),
    };

    apiServiceMock = {
      validateBookingToken: jasmine
        .createSpy('validateBookingToken')
        .and.returnValue(Promise.resolve(true)),
    };

    await TestBed.configureTestingModule({
      declarations: [ConnectionCardComponent],
      imports: [AppModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: FirestoreService, useValue: firestoreServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionCardComponent);
    component = fixture.componentInstance;
    component.item = {
      id: '057b17294cf24cf997bddd12_0|057b17294cf24cf997bddd12_1|057b17294cf24cf997bddd12_2|057b17294cf24cf997bddd12_3',
      flyFrom: 'ZRH',
      flyTo: 'FRA',
      cityFrom: 'Zürich',
      cityTo: 'Frankfurt',
      price: 238,
      deep_link:
        'https://www.kiwi.com/deep?affilid=aviator748alpha&currency=CHF&flightsId=057b17294cf24cf997bddd12_0%7C057b17294cf24cf997bddd12_1%7C057b17294cf24cf997bddd12_2%7C057b17294cf24cf997bddd12_3&from=ZRH&lang=en&passengers=1&to=FRA&booking_token=Gu1-zUuSDt-GbSi9Wk9MtqVVfRsDp7QjhuIRtN0_C-BAzUULF4xMhGvU-qo8RwlLQs0NttQ-AoeOWyPxEsYwPRuJmmbJ-r5S5WZ59mmReZx8T755g6jJuSV-t6-bYekAQMJoi5BNrJBzoWFD3jPfaos__S3VCdz0AYMpm2KKF7yTZHFDTmzAh5sncJUHvnBorUOJB6vI87yc0Psy0ZrJj_QD0AuGZaXhebnG7ZrdZLvhRsT-zTTu9-HpUtUkBB0jXGTuS0aCtMOCe7Vkg2DNGOOvUY6CHzwaGmgCs9JJiZ-X1istQuforhnWlW5aQP1Jv5YgrDC3M5nFHieG9sy0NNH_RZLBhIoV95aKhre-Mwxf2h4FikvFF8m8iEx4hLvVPWrU51x7_Di11gKWYt5n-ZSiDA58GeCcbeL2Ts8P64jNImOL5szTFoz9CLCkwSWcEdhZ5PKRvIAgFVbjOixPucYcFHT_yIpYX4_o8rlMetd2bnOoubuI5eVnecKZropkfJ7cAXa-xNjRHscvA52gheA1Zud67z69qYg3IRX85LorQdcizLgfm5ve6fJ5Agbhl',
      local_departure: '2023-12-07T06:45:00.000Z',
      local_arrival: '2023-12-07T19:15:00.000Z',
      route: [{}],
      duration: { departure: 180, return: 180, total: 360 },
    } as TripSegment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should save a favourite connection when saveFavouriteConnection is called', () => {
      component.user = { uid: 'mockUid123', email: 'test@example.com' } as User;
      component.saveFavouriteConnection();
      expect(firestoreServiceMock.saveFavouriteConnection).toHaveBeenCalledWith('mockUid123', component.item);
      expect(component.deleteOption).toBe(true);
    });

    it('should delete a favourite connection when deleteFavouriteConnection is called', () => {
      component.user = { uid: 'mockUid123', email: 'test@example.com' } as User;
      component.deleteOption = true;
      component.deleteFavouriteConnection();
      expect(firestoreServiceMock.deleteFavouriteConnection).toHaveBeenCalledWith('mockUid123', component.item.id);
      expect(component.deleteOption).toBe(false);
    });
});
