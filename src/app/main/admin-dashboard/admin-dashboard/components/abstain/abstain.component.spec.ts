import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstainComponent } from './abstain.component';

describe('AbstainComponent', () => {
  let component: AbstainComponent;
  let fixture: ComponentFixture<AbstainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
