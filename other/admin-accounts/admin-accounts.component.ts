import { Component, OnInit } from '@angular/core';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { adminAccountConstants } from '../constants/admin-account.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../../constants/global-constants';
import { AdminAccountCommunicationService } from '../services/admin-account/admin-account-communication.service';
import { MatDialog, MatDialogConfig, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material';
import { ICustomMatTableConfig } from '../../../shared/components/custom-mat-table/custom-mat-table.model';
import { AdminAccountService } from '../services/admin-account/admin-account.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css'],
  providers: [MatDialog, MatSnackBar]
})
export class AdminAccountsComponent implements OnInit {
  error: string;
  updatedata: any;
  deleteData: any;
  modalConfig: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  RECORD_DELETE_SUCESS_MSG = 'Record deleted successfully';
  EDIT = 'Edit';
  DELETE = 'Delete';
  END_NOW_MSG = 'End now';
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
    private _adminAccountService: AdminAccountService,
    public snackBar: MatSnackBar) {
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

  openConfirmationModal(): any {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: 1,
        title: 'Confirmation'
    };

    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAdminAccount();
      } else {
        this.dialog.closeAll();
      }
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
    if (eventObj.link === this.EDIT) {
      this.openDialog();
      this._adminAccountCommunicationService.changeMessage(eventObj.row);      
    } else if (eventObj.link === this.DELETE) {
      this.deleteData = eventObj.row;
      this.openConfirmationModal();
    }    
  }

  openSnackBar(message: string): any {
    this.snackBar.open(message, this.END_NOW_MSG, {
      duration: 500,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  /**
    * @name deleteAdminAccount
    * @desc delete a particular record from data table
    * @param {void}
    * @returns {observale}
    */
   deleteAdminAccount(): any {
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
            this.openSnackBar(this.RECORD_DELETE_SUCESS_MSG);
          }
        }, error => this.error = error);
    }
  }
}
