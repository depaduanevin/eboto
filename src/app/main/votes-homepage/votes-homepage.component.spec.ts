import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotesHomepageComponent } from './votes-homepage.component';

describe('VotesHomepageComponent', () => {
  let component: VotesHomepageComponent;
  let fixture: ComponentFixture<VotesHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotesHomepageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotesHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
