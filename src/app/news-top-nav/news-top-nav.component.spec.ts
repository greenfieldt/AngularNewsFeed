import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTopNavComponent } from './news-top-nav.component';

describe('NewsTopNavComponent', () => {
  let component: NewsTopNavComponent;
  let fixture: ComponentFixture<NewsTopNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsTopNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsTopNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
