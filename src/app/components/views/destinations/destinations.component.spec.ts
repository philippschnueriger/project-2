import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DestinationsComponent } from './destinations.component';
import { AppModule } from 'src/app/app.module';

describe('DestinationsComponent', () => {
  let component: DestinationsComponent;
  let fixture: ComponentFixture<DestinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DestinationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a heading "Explore new destinations"', () => {
    const compiled = fixture.nativeElement;
    const headingElement = compiled.querySelector('h1');
    expect(headingElement.textContent).toContain('Explore new destinations');
  });
});
