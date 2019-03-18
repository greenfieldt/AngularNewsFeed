import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardListComponent } from './news-card-list.component';

describe('NewsCardListComponent', () => {
  let component: NewsCardListComponent;
  let fixture: ComponentFixture<NewsCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
