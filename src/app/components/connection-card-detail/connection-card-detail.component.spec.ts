import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionCardDetailComponent } from './connection-card-detail.component';
import { AppModule } from '../../app.module';


describe('ConnectionCardDetailComponent', () => {
  let component: ConnectionCardDetailComponent;
  let fixture: ComponentFixture<ConnectionCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [AppModule],
      declarations: [ConnectionCardDetailComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expand correctly', () => {
    component.expand = false;
    component.toggleExpand();
    expect(component.expand).toBe(true);

    component.toggleExpand();
    expect(component.expand).toBe(false);
  });
});
