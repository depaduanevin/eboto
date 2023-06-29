import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteSubmittedComponent } from './vote-submitted.component';

describe('VoteSubmittedComponent', () => {
  let component: VoteSubmittedComponent;
  let fixture: ComponentFixture<VoteSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteSubmittedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
