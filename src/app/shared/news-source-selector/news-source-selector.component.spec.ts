import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSourceSelectorComponent } from './news-source-selector.component';

describe('NewsSourceSelectorComponent', () => {
  let component: NewsSourceSelectorComponent;
  let fixture: ComponentFixture<NewsSourceSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsSourceSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsSourceSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
