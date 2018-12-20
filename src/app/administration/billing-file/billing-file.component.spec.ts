import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingFileComponent } from './billing-file.component';

describe('BillingFileComponent', () => {
  let component: BillingFileComponent;
  let fixture: ComponentFixture<BillingFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
