import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelRing } from './level-ring';

describe('LevelRing', () => {
  let component: LevelRing;
  let fixture: ComponentFixture<LevelRing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelRing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelRing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
