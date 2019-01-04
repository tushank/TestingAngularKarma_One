import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConfigComponent } from './edit-config.component';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { AppModule } from '../../../../app.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { OndotConfigService } from '../../services/ondot-config/ondot-config.service';

describe('EditConfigComponent', () => {
    let component: EditConfigComponent;
    let fixture: ComponentFixture<EditConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditConfigComponent],
            providers: [MatSnackBar, OndotConfigService, { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} }],
            imports: [AppModule, HttpClientModule, HttpClientTestingModule, FormsModule, MatDialogModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
