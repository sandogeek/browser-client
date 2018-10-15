import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketSubjectComponent } from './web-socket-subject.component';

describe('WebSocketSubjectComponent', () => {
  let component: WebSocketSubjectComponent;
  let fixture: ComponentFixture<WebSocketSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebSocketSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSocketSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
