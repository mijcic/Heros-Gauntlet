import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunOverview } from './run-overview';

describe('RunOverview', () => {
  let component: RunOverview;
  let fixture: ComponentFixture<RunOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RunOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RunOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
