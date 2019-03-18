import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentButtonComponent } from './comment-button.component';

describe('CommentButtonComponent', () => {
  let component: CommentButtonComponent;
  let fixture: ComponentFixture<CommentButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
