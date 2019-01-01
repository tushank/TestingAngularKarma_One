import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { IAdminAccount, IAdminGroupsDTOList } from './admin-account-detail';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { adminAccountConstants } from '../../../../constants/admin-account.constants';
import { GlobalConstants } from '../../../../constants/global-constants';
import { adminGroupConstants } from '../../../../constants/admin-group.constants';
import { AdminAccountCommunicationService } from '../../../../services/administration/admin-account/admin-account-communication.service';
import { CustomModalComponent } from '../../../../shared/custom-modal/custom-modal.component';
import { MODAL_CONFIG } from '../../../../shared/config/custom-modal.config';
@Component({
  selector: 'app-admin-account-detail',
  templateUrl: './admin-account-detail.component.html',
  styleUrls: ['./admin-account-detail.component.css']
})
export class AdminAccountDetailComponent implements OnInit {
  @ViewChild('f') signupForm: NgForm;
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

  constructor(private http: HttpClient, private globalConstants: GlobalConstants,
    public bsModalRef: BsModalRef, private adminAccountService: AdminAccountCommunicationService, private _modalService: BsModalService) {
      this.modalConfig = MODAL_CONFIG.BASE_CONFIG;
    }


  ngOnInit() {
    this.getAdminGroupList();
    this.adminAccountService.currentMessage.subscribe(message => {
      this.updatedata = message;
      if (this.updatedata) {
        this.model = this.updatedata;
          this.signupForm.form.patchValue({
            loginName: this.model.loginName,
            password: this.model.password,
            fullName: this.model.fullName,
            adminDescription: this.model.adminDescription,
            adminGroupId: this.model.adminGroupName
          });
      }
    });
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
    this.signupForm.reset();
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
          this.bsModalRef.hide();
          this.adminAccountService.refreshAccountTable();
          this.updateModalConfig('Success', 'data posted successfully! ', 'success');
          this._modalService.show(CustomModalComponent, this.modalConfig);
        }
      }, error => this.error = error);
  }

  /**
    * @name updateModalConfig
    * @desc modal pop-up to show information
    * @param {string, string, string}
    * @returns {void}
    */
  updateModalConfig(header: string, msg: string, type: string) {
    this.modalConfig.initialState.header = header;
    this.modalConfig.initialState.message = msg;
    this.modalConfig.initialState.type = type;
  }
}
