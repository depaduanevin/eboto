import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVotersComponent } from './manage-voters.component';

describe('ManageVotersComponent', () => {
  let component: ManageVotersComponent;
  let fixture: ComponentFixture<ManageVotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVotersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
