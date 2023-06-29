import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotPositionsComponent } from './ballot-positions.component';

describe('BallotPositionsComponent', () => {
  let component: BallotPositionsComponent;
  let fixture: ComponentFixture<BallotPositionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallotPositionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
