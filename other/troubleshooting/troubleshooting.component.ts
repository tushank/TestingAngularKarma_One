import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CustomerSupportService } from 'src/app/services';
import { ITableInfo } from './matching-customer-list/custom-data-table/custom-data-table.model';
import { customerSupportConstants } from 'src/app/constants/customer-support.constants';

@Component({
  selector: 'app-troubleshooting',
  templateUrl: './troubleshooting.component.html',
  styleUrls: ['./troubleshooting.component.css']
})
export class TroubleshootingComponent implements OnInit {
  customerInfoForm: FormGroup;
  tableConfig: ITableInfo;
  tempTableConfig: ITableInfo;
  constructor(private _customerSupportService: CustomerSupportService) { }

  ngOnInit() {
    this.tableConfig = null;
    this.tempTableConfig = null;
  }

  searchCustomer(customerInfoForm: FormGroup) {
    if (this.tableConfig) {
      this.tableConfig.isAsyncEventComplete = false;
    }

    this.customerInfoForm = customerInfoForm ? customerInfoForm : this.customerInfoForm;
    const reqObj = this._customerSupportService.getSearchCustomersReqObj(this.customerInfoForm);
    let tableConfig = this.tempTableConfig;
    reqObj.page = tableConfig ? tableConfig.currentPageNumber : 1;
    reqObj.rows = tableConfig ? tableConfig.itemsPerPageInfo.activeOption : 10;
    this._customerSupportService.getMatchingCustomerList(reqObj).subscribe((response) => {
      if (!tableConfig) {
        tableConfig = this._customerSupportService.getGridConfig();
      }
      tableConfig.rowsInfo.rowsList = response.customerDTOList;
      tableConfig.totalRecords = response.total;
      tableConfig.currentPageNumber = tableConfig.rowsInfo.rowsList.length === 0 ? 1 : tableConfig.currentPageNumber;
      this.tableConfig = tableConfig;
      this.tableConfig.isAsyncEventComplete = true;
    }, (error) => {
      // console.log(error);
      this.tableConfig.isAsyncEventComplete = true;
    });
  }


  handleTableEvent($event) {
    this.tempTableConfig = Object.assign({}, this.tableConfig);
    let maxPages = Math.ceil(this.tempTableConfig.totalRecords / this.tempTableConfig.itemsPerPageInfo.activeOption);
    switch ($event.event) {
      case customerSupportConstants.GRID_EVENT_TYPES.GO_TO_FIRST_PAGE:
        this.tempTableConfig.currentPageNumber = 1;
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.GO_TO_LAST_PAGE:
        this.tempTableConfig.currentPageNumber = maxPages;
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.GO_TO_NEXT_PAGE:
        this.tempTableConfig.currentPageNumber++;
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.GO_TO_PREVIOUS_PAGE:
        this.tempTableConfig.currentPageNumber--;
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.LINK_CLICK:
      //  console.log($event.data);
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.PAGE_LIST_CHANGE:
        this.tempTableConfig.itemsPerPageInfo.activeOption = Number($event.data);
        maxPages = Math.ceil(this.tempTableConfig.totalRecords / this.tempTableConfig.itemsPerPageInfo.activeOption);
        if (this.tempTableConfig.currentPageNumber > maxPages) {
          this.tempTableConfig.currentPageNumber = maxPages;
        }
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.PAGE_NUMBER_CHANGE:
        this.tempTableConfig.currentPageNumber = Number($event.data);
        break;
      case customerSupportConstants.GRID_EVENT_TYPES.REFRESH:
        break;
    }
    this.searchCustomer(null);
  }


}
