import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { IAdminAccount, IAdminGroupsDTOList } from './admin-account-detail';
import { adminAccountConstants } from '../../constants/admin-account.constants';
import { GlobalConstants } from '../../../../constants/global-constants';
import { adminGroupConstants } from '../../constants/admin-group.constants';
import { AdminAccountCommunicationService } from '../../services/admin-account/admin-account-communication.service';
import { MatDialogRef } from '../../../../../../node_modules/@angular/material';
@Component({
  selector: 'app-admin-account-detail',
  templateUrl: './admin-account-detail.component.html',
  styleUrls: ['./admin-account-detail.component.css']
})
export class AdminAccountDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('signupForm') signupForm: NgForm;
  defaultAdminGroups = '';
  model: any = {};
  submitted = false;
  adminGroupsDTOLists: IAdminGroupsDTOList[];
  error: string;
  ADD_NEW_USER = -1;
  updatedata: any;
  modalConfig: any;
  msg: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, x-auth'
    })
  };

  constructor(public dialogRef: MatDialogRef<AdminAccountDetailComponent>,
    private globalConstants: GlobalConstants, private http: HttpClient,
    private _adminAccountCommunicationService: AdminAccountCommunicationService) {
  }


  ngOnInit() {
    this.getAdminGroupList();
    this._adminAccountCommunicationService.currentMessage.subscribe(message => {
      if (message) {
        this.updatedata = message;
      }
    });
  }

  ngAfterViewInit() {
    if (this.updatedata) {
      this.model = this.updatedata;
      this.signupForm.form.setValue({
        loginName: this.updatedata.loginName,
        password: this.updatedata.password,
        fullName: this.updatedata.fullName,
        adminDescription: this.updatedata.adminDescription,
        adminGroupId: this.updatedata.adminGroupName
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
    * @name getAdminGroupList
    * @desc get the data of admin group
    * @param {void}
    * @returns {observale}
    */
  getAdminGroupList() {
    const requestData = {
      SessionID: localStorage.getItem('sessionID'),
      IP: window.location.hostname
    };

    return this.http.post(
      this.globalConstants.FI_SERVER_BASE_URL + adminGroupConstants.LIST_ALL.URL,
      requestData, this.httpOptions).subscribe((data: any) => {
        if (data) {
          this.adminGroupsDTOLists = data.adminGroupsDTOList;
        }
      }, error => this.error = error);
  }

  /**
    * @name onSubmit
    * @desc Submit the form object
    * @param {void}
    * @returns {void}
    */
  onSubmit(): void {
    this.submitted = true;
    this.model.loginName = this.signupForm.value.loginName;
    this.model.fullName = this.signupForm.value.fullName;
    this.model.adminDescription = this.signupForm.value.adminDescription;
    this.model.adminGroupId = Number(this.signupForm.value.adminGroupId);
    if (this.updatedata) {
      this.model.password = null;
    } else {
      this.model.password = this.signupForm.value.password;
    }
    this.postdataOnSubmit(this.model);
  }

  /**
  * @name getRequestDataAdminAccount
  * @desc set the request object for posting the new admin account detail from form
  * @param {object} accountUserDeatil object of accountUserDeatil interface
  * @returns {object}
  */
  getRequestDataAdminAccount(accountUserDeatil: IAdminAccount): any {
    const reqObj = adminAccountConstants.SAVE.REQ_OBJ;
    reqObj.sessionID = localStorage.getItem('sessionID');
    reqObj.IP = window.location.hostname;
    reqObj.adminAccountsDTO.loginName = accountUserDeatil.loginName;
    reqObj.adminAccountsDTO.password = accountUserDeatil.password;
    reqObj.adminAccountsDTO.fullName = accountUserDeatil.fullName;
    reqObj.adminAccountsDTO.adminDescription = accountUserDeatil.adminDescription;
    reqObj.adminAccountsDTO.adminGroupId = accountUserDeatil.adminGroupId;
    if (this.updatedata) {
      reqObj.adminAccountsDTO.adminAccountId = this.updatedata.adminAccountId;
    } else {
      reqObj.adminAccountsDTO.adminAccountId = this.ADD_NEW_USER;
    }
    return reqObj;
  }

  /**
    * @name postdataOnSubmit
    * @desc Posting the new admin account detail from form
    * @param {object} accountUserDeatil object of accountUserDeatil interface
    * @returns {observable}
    */
  postdataOnSubmit(accountUserDeatil: IAdminAccount) {
    return this.http.post(
      this.globalConstants.FI_SERVER_BASE_URL + adminAccountConstants.SAVE.URL,
      this.getRequestDataAdminAccount(accountUserDeatil), this.httpOptions).subscribe((response: any) => {
        if (response.statusCode === 0) {
          this._adminAccountCommunicationService.refreshAccountTable();
          alert('data post success');
          this.dialogRef.close();
          this.signupForm.reset();
        }
      }, error => this.error = error);
  }
}

