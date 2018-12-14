import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInfoSearchPanelComponent } from './customer-info-search-panel.component';

describe('CustomerInfoSearchPanelComponent', () => {
  let component: CustomerInfoSearchPanelComponent;
  let fixture: ComponentFixture<CustomerInfoSearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerInfoSearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInfoSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
