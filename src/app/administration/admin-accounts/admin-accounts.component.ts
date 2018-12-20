import { Component, OnInit, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ITableInfo } from '../../customer-support/troubleshooting/matching-customer-list/custom-data-table/custom-data-table.model';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemEventsService } from '../../../services/administration/system-events/system-events.service';
import { adminAccountConstants } from '../../../constants/admin-account.constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpClientService } from '../../../services/http-client.service';
import { GlobalConstants } from '../../../constants/global-constants';
import { AdminAccountService } from '../../../services/administration/admin-account/admin-account.service';
import { Observable } from '../../../../../node_modules/rxjs';


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
    private dataService: AdminAccountService) {}
  @Input() tableInfo: ITableInfo;

  ngOnInit() {
    this.updateTable();
    this.dataService.currentMessage.subscribe(message => {
      this.updateTable();
      this.updatedata = message;
    });
  }

  /**
    * @name updateTable
    * @desc get the list of all record to display it on data table
    * @param {number,number}
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
    * @param {object}
    * @returns {object}
    */
  getEventsList(reqObj) {
    return this.httpClient.post(this.globalConstants.FI_SERVER_BASE_URL + adminAccountConstants.LIST_ALL.URL,
      reqObj, this.globalConstants.CONTENT_TYPE_JSON, true);
  }

  /**
    * @name getGridConfig
    * @desc set the configuration of data table
    * @param {void}
    * @returns {void}
    */
  getGridConfig() {
    return (adminAccountConstants.GRID_CONFIG);
  }

  /**
    * @name openModalWithComponent
    * @desc open the the pop-up model for addition or updating the form
    * @param {void}
    * @returns {void}
    */
  openModalWithComponent() {
    this.dataService.changeMessage(null);
    this.bsModalRef = this.modalService.show(AdminAccountDetailComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  /**
    * @name openModal
    * @desc open the the pop-up model for delection of record
    * @param {TemplateRef}
    * @returns {void}
    */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  /**
    * @name confirm
    * @desc confirm the dellte functionality for a record in pop-up model
    * @param {void}
    * @returns {void}
    */
  confirm(): void {
    this.modalRef.hide();
    this.deleteAdminAccount();
  }

  /**
    * @name decline
    * @desc cancel the dellte functionality in pop-up model
    * @param {void}
    * @returns {void}
    */
  decline(): void {
    this.modalRef.hide();
  }

  /**
    * @name handleUpdateClickEvent
    * @desc for handle edit and delete click functionality
    * @param {object}
    * @returns {void}
    */
  handleUpdateClickEvent($event) {
    const eventObj = $event;
    if (eventObj.link === 'Edit') {
      this.bsModalRef = this.modalService.show(AdminAccountDetailComponent);
      this.bsModalRef.content.closeBtnName = 'Close';
      this.dataService.changeMessage(eventObj.rowItem);
    } else if (eventObj.link === 'Delete') {
      console.log('eventObj.rowItem delete : ', eventObj.rowItem);
      this.deleteData = eventObj.rowItem;
      this.openModal(this.deleteTemplate);
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
        requestData, this.httpOptions).subscribe((data: any) => {
          if (data) {
            console.log('post data : ', data);
            this.updateTable();
            alert('Deleted data Successfully !');
          }
        }, error => this.error = error);
    }
  }
}
