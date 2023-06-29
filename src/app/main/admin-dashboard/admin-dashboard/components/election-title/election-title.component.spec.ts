import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionTitleComponent } from './election-title.component';

describe('ElectionTitleComponent', () => {
  let component: ElectionTitleComponent;
  let fixture: ComponentFixture<ElectionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectionTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
