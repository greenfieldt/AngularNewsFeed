import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsGridListComponent } from './news-grid-list.component';

describe('NewsGridListComponent', () => {
  let component: NewsGridListComponent;
  let fixture: ComponentFixture<NewsGridListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsGridListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsGridListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
