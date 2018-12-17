import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTestComponent } from './ui-test.component';

describe('UiTestComponent', () => {
  let component: UiTestComponent;
  let fixture: ComponentFixture<UiTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
