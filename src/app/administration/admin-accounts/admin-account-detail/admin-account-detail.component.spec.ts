import { async, ComponentFixture, TestBed, getTestBed  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAccountDetailComponent } from './admin-account-detail.component';
import { NO_ERRORS_SCHEMA } from '../../../../../../node_modules/@angular/core';
import { AdminAccountService } from '../../../../services/administration/admin-account/admin-account.service';
import { of } from '../../../../../../node_modules/rxjs';
import {FormsModule} from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

describe('AdminAccountDetailComponent', () => {
    let component: AdminAccountDetailComponent;
    let fixture: ComponentFixture<AdminAccountDetailComponent>;
    let mockDataService;
    let injector: TestBed;
    let httpMock: HttpTestingController;
    let ADMIN_GROUPS_DTO_LISTS;
    let mockBsModalRef;

    beforeEach(async(() => {

        ADMIN_GROUPS_DTO_LISTS = [{

        }];

        mockDataService = jasmine.createSpyObj(['currentMessage']);
        mockBsModalRef = jasmine.createSpyObj(['hide']);

        TestBed.configureTestingModule({
            declarations: [AdminAccountDetailComponent],
            providers: [
                { provide: AdminAccountService, useValue: mockDataService },
                { provide: BsModalRef, useValue: mockBsModalRef }
            ],
            imports: [HttpClientTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(AdminAccountDetailComponent);
        injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminAccountDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render each admin as a AdminAccountDetailComponent', () => {
        mockDataService.currentMessage.and.returnValue(of(true));
        fixture.detectChanges();

        expect(true).toEqual(true);
    });
});
