import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndotConfigComponent } from './ondot-config.component';

describe('OndotConfigComponent', () => {
  let component: OndotConfigComponent;
  let fixture: ComponentFixture<OndotConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndotConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OndotConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
