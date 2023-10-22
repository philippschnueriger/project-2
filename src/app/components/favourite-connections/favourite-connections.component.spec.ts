import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteConnectionsComponent } from './favourite-connections.component';

describe('FavouriteConnectionsComponent', () => {
  let component: FavouriteConnectionsComponent;
  let fixture: ComponentFixture<FavouriteConnectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouriteConnectionsComponent]
    });
    fixture = TestBed.createComponent(FavouriteConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
