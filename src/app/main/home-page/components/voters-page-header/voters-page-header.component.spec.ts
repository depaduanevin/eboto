import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersPageHeaderComponent } from './voters-page-header.component';

describe('VotersPageHeaderComponent', () => {
  let component: VotersPageHeaderComponent;
  let fixture: ComponentFixture<VotersPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotersPageHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotersPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
