import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountDetailComponent } from './admin-account-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AdminAccountCommunicationService } from '../../services/admin-account/admin-account-communication.service';
import { FormsModule } from '@angular/forms';
import { AppModule } from '../../../../app.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar, MatDialogRef } from '@angular/material';

describe('AdminAccountDetailComponent', () => {
  let component: AdminAccountDetailComponent;
  let fixture: ComponentFixture<AdminAccountDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAccountDetailComponent],
      providers: [MatSnackBar, MatDialogRef],
      imports: [ AppModule, HttpClientModule, HttpClientTestingModule, FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
