import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveManager } from './move-manager';

describe('MoveManager', () => {
  let component: MoveManager;
  let fixture: ComponentFixture<MoveManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
