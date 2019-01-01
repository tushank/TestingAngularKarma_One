import { Component, OnInit } from '@angular/core';

import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';


import { adminAccountConstants } from '../constants/admin-account.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';

import { GlobalConstants } from '../../../constants/global-constants';
import { AdminAccountCommunicationService } from '../services/admin-account/admin-account-communication.service';
import { MatDialog } from '@angular/material';
import { ICustomMatTableConfig } from '../../../shared/components/custom-mat-table/custom-mat-table.model';
import { AdminAccountService } from '../services/admin-account/admin-account.service';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css'],
  providers: [MatDialog]
})
export class AdminAccountsComponent implements OnInit {
  error: string;
  updatedata: any;
  deleteData: any;
  modalConfig: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, x-auth'
    })
  };

  adminAccountTableConfig: ICustomMatTableConfig;

  adminAccountTableData: any[];

  constructor(public dialog: MatDialog,
    private _adminAccountCommunicationService: AdminAccountCommunicationService,
    private http: HttpClient, private globalConstants: GlobalConstants,
    private _adminAccountService: AdminAccountService) {
  }

  ngOnInit() {
    this.getTableConfigurations();
    this.getAdminAccountData();

    this._adminAccountCommunicationService.getRefreshAccountTable().subscribe(data => {
      this.getAdminAccountData();
    });

  }

  getTableConfigurations(): void {
    this.adminAccountTableConfig = this._adminAccountService.getAdminAccountGridConfig();
  }

  getAdminAccountData(): void {
    const reqObj = this._adminAccountService.getAdminAccountReqObj();
    this._adminAccountService.getAdminAccountList(reqObj).subscribe((response) => {
      if (response.statusCode === 0) {
        this.updateAdminAccountTableData(response.adminAccountsDTOList);
      }
    }, (error) => {

    });
  }

  updateAdminAccountTableData(list: Array<any>): void {
    this.adminAccountTableData = Object.assign([], list);
  }
  
  openDialog(): void {
    this._adminAccountCommunicationService.changeMessage(null);
    const dialogRef = this.dialog.open(AdminAccountDetailComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  /**
    * @name handleUpdateClickEvent
    * @desc for handle edit and delete click functionality
    * @param {object}
    * @returns {void}
    */
   handleEvent($event): any {
    const eventObj = $event;
    if (eventObj.link === 'Edit') {
      this.openDialog();
      this._adminAccountCommunicationService.changeMessage(eventObj.row);      
    } else if (eventObj.link === 'Delete') {
      this.deleteData = eventObj.row;
      this.deleteAdminAccount();
    }    
  }

  /**
    * @name deleteAdminAccount
    * @desc delete a particular record from data table
    * @param {void}
    * @returns {observale}
    */
   deleteAdminAccount() {
    if (this.deleteData && this.deleteData.adminAccountId) {
      const requestData = {
        SessionID: localStorage.getItem('sessionID'),
        IP: window.location.hostname,
        accountId: this.deleteData.adminAccountId
      };

      return this.http.post(
        this.globalConstants.FI_SERVER_BASE_URL + adminAccountConstants.DELETE_ADMIN_ACCOUNT.URL,
        requestData, this.httpOptions).subscribe((response: any) => {
          if (response.statusCode === 0) {
            this.getAdminAccountData();
            alert('deleted successfully');
          }
        }, error => this.error = error);
    }
  }
}
