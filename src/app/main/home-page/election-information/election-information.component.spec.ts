import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionInformationComponent } from './election-information.component';

describe('ElectionInformationComponent', () => {
  let component: ElectionInformationComponent;
  let fixture: ComponentFixture<ElectionInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectionInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
