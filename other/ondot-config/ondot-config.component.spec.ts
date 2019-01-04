import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OndotConfigComponent } from './ondot-config.component';
import { EditConfigComponent } from './edit-config/edit-config.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { OndotConfigService } from '../services/ondot-config/ondot-config.service';
import { AppModule } from '../../../app.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('OndotConfigComponent', () => {
  let component: OndotConfigComponent;
  let fixture: ComponentFixture<OndotConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OndotConfigComponent, EditConfigComponent ],
      providers: [ OndotConfigService, MatDialog, MatSnackBar ],
      imports: [ AppModule, HttpClientModule, HttpClientTestingModule, FormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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
