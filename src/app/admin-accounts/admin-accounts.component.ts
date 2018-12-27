import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ITableInfo } from '../../customer-support/troubleshooting/matching-customer-list/custom-data-table/custom-data-table.model';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemEventsService } from '../../../services/administration/system-events/system-events.service';
import { adminAccountConstants } from '../../../constants/admin-account.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpClientService } from '../../../services/http-client.service';
import { GlobalConstants } from '../../../constants/global-constants';
import { AdminAccountCommunicationService } from '../../../services/administration/admin-account/admin-account-communication.service';
import { CustomModalComponent } from '../../../shared/custom-modal/custom-modal.component';
import { MODAL_CONFIG } from '../../../shared/config/custom-modal.config';


@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any>;

  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  tableConfig: ITableInfo;
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

  constructor(private http: HttpClient, private httpClient: HttpClientService,
    private modalService: BsModalService, private globalConstants: GlobalConstants,
    private _systemEventServices: SystemEventsService,
    private adminAccountService: AdminAccountCommunicationService) {
      this.modalConfig = MODAL_CONFIG.BASE_CONFIG;
    }
  @Input() tableInfo: ITableInfo;

  ngOnInit() {
    this.updateTable();
    this.adminAccountService.currentMessage.subscribe(message => {
      this.updatedata = message;
    });

    this.adminAccountService.getRefreshAccountTable().subscribe(data => {
      this.updateTable();
    });
  }

  /**
    * @name updateTable
    * @desc get the list of all record to display it on data table
    * @returns {Observable}
    */
  updateTable() {
    if (this.tableConfig) {
      this.tableConfig.isAsyncEventComplete = false;
    }

    const reqObj = this._systemEventServices.getSystemEventsReqObj(null, null);
    this.getEventsList(reqObj).subscribe(response => {
      if (response.statusCode === 0 && response && response.adminAccountsDTOList) {
        console.log('response.adminAccountsDTOList ', response.adminAccountsDTOList);
        this.tableConfig = this.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.adminAccountsDTOList;
        this.tableConfig.isAsyncEventComplete = true;
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => this.error = error);
  }

  /**
    * @name getEventsList
    * @desc set the request object for data table list record api call
    * @param reqObj
    * @returns {object}
    */
  getEventsList(reqObj) {
    return this.httpClient.post(this.globalConstants.FI_SERVER_BASE_URL + adminAccountConstants.LIST_ALL.URL,
      reqObj, this.globalConstants.CONTENT_TYPE_JSON, false);
  }

  /**
    * @name getGridConfig
    * @desc set the configuration of data table
    * @returns {void}
    */
  getGridConfig() {
    return (adminAccountConstants.GRID_CONFIG);
  }

  /**
    * @name openModalWithComponent
    * @desc open the the pop-up model for addition or updating the form
    * @returns {void}
    */
  openModalWithComponent() {
    this.adminAccountService.changeMessage(null);
    this.bsModalRef = this.modalService.show(AdminAccountDetailComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  /**
    * @name openModal
    * @desc open the the pop-up model for delection of record
    * @param template
    * @returns {void}
    */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  /**
    * @name confirm
    * @desc confirm the dellte functionality for a record in pop-up model
    * @returns {void}
    */
  confirm(): void {
    this.modalRef.hide();
    this.deleteAdminAccount();
  }

  /**
    * @name decline
    * @desc cancel the dellte functionality in pop-up model
    * @returns {void}
    */
  decline(): void {
    this.modalRef.hide();
  }

  /**
    * @name handleUpdateClickEvent
    * @desc for handle edit and delete click functionality
    * @param $event
    * @returns {void}
    */
  handleUpdateClickEvent($event) {
    const eventObj = $event;
    if (eventObj.link === 'Edit') {
      this.bsModalRef = this.modalService.show(AdminAccountDetailComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.adminAccountService.changeMessage(eventObj.rowItem);
    } else if (eventObj.link === 'Delete') {
      console.log('eventObj.rowItem delete : ', eventObj.rowItem);
      this.deleteData = eventObj.rowItem;
      this.openModal(this.deleteTemplate);
    }
  }

  /**
    * @name deleteAdminAccount
    * @desc delete a particular record from data table
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
            this.updateModalConfig('Success', 'Deleted data Successfully ! ', 'success');
            this.modalService.show(CustomModalComponent, this.modalConfig);
            this.updateTable();
          }
        }, error => this.error = error);
    }
  }

  updateModalConfig(header: string, msg: string, type: string) {
    this.modalConfig.initialState.header = header;
    this.modalConfig.initialState.message = msg;
    this.modalConfig.initialState.type = type;
  }
}
