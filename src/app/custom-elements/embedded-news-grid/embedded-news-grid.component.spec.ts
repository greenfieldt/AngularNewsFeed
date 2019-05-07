import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedNewsGridComponent } from './embedded-news-grid.component';

describe('EmbeddedNewsGridComponent', () => {
  let component: EmbeddedNewsGridComponent;
  let fixture: ComponentFixture<EmbeddedNewsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedNewsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedNewsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
