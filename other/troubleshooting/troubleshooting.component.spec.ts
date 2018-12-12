import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TroubleshootingComponent } from './troubleshooting.component';
import { of } from 'rxjs';
import { CustomerInfoSearchPanelComponent } from './customer-info-search-panel/customer-info-search-panel.component';
import { MatchingCustomerListComponent } from './matching-customer-list/matching-customer-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomerSupportService } from 'src/app/services';

describe('TroubleshootingComponent', () => {
  let component: TroubleshootingComponent;
  let fixture: ComponentFixture<TroubleshootingComponent>;
  let TABLE_CONFIG;
  let mockCustomerSupportService;
  let CUSTOMER_INFO_FORM;

  beforeEach(() => {
    mockCustomerSupportService = jasmine.createSpyObj(['getSearchCustomersReqObj', 'getMatchingCustomerList', 'getGridConfig']);
    TestBed.configureTestingModule({
      declarations: [TroubleshootingComponent, CustomerInfoSearchPanelComponent, MatchingCustomerListComponent],
      providers: [
        { provide: CustomerSupportService, useValue: mockCustomerSupportService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TroubleshootingComponent);

    TABLE_CONFIG = {
      isPaginationEnabled: false,
      isRefreshTableEnabled: false,
      isPerPageItemCountEnabled: false,
      isHorizontalScrollEnabled: false,
      isRowSrNumEnabled: false,
      currentPageNumber: 20,
      totalRecords: 10,
      isAsyncEventComplete: false
    };

    CUSTOMER_INFO_FORM = {
      controls: {
        accountNumber: {
          status: 'VALID'
        }
      }
    };
  });

  // it('should set the isAsyncEventComplete to false', () => {
  //   component.tableConfig = TABLE_CONFIG;
  //   const val = component.searchCustomer(CUSTOMER_INFO_FORM);
  //   expect(true).toBe(true);
  // });


  // describe('searchCustomer', () => {
  //   // it('should set the isAsyncEventComplete to false', () => {
  //   //   mockCustomerSupportService.getMatchingCustomerList.and.returnValue(of(TABLE_CONFIG));
  //   //   expect(true).toBe(true);
  //   // });
  // });
});
