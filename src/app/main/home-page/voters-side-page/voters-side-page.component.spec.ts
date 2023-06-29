import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersSidePageComponent } from './voters-side-page.component';

describe('VotersSidePageComponent', () => {
  let component: VotersSidePageComponent;
  let fixture: ComponentFixture<VotersSidePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotersSidePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotersSidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
