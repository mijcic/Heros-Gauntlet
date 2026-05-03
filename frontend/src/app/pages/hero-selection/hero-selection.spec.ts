import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSelection } from './hero-selection';

describe('HeroSelection', () => {
  let component: HeroSelection;
  let fixture: ComponentFixture<HeroSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
