import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotersPageFooterComponent } from './voters-page-footer.component';

describe('VotersPageFooterComponent', () => {
  let component: VotersPageFooterComponent;
  let fixture: ComponentFixture<VotersPageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VotersPageFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotersPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
