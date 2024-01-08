import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedFavouritesComponent } from './shared-favourites.component';

describe('SharedFavouritesComponent', () => {
  let component: SharedFavouritesComponent;
  let fixture: ComponentFixture<SharedFavouritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedFavouritesComponent]
    });
    fixture = TestBed.createComponent(SharedFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
