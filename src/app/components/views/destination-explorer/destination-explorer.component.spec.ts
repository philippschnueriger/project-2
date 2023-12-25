import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DestinationExplorerComponent } from './destination-explorer.component';
import { AppModule } from 'src/app/app.module';

describe('DestinationExplorerComponent', () => {
  let component: DestinationExplorerComponent;
  let fixture: ComponentFixture<DestinationExplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [DestinationExplorerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationExplorerComponent);
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
