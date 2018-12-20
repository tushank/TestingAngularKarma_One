import { Component, OnInit } from '@angular/core';
import { AdminSystemDiagnosticsService } from 'src/app/services/administration/admin-system-diagnostics.service';
import { MODAL_CONFIG } from '../../../shared/config/custom-modal.config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { ITableInfo } from 'src/app/shared/custom-data-table2/custom-data-table.model';

@Component({
  selector: 'app-system-diagnostics',
  templateUrl: './system-diagnostics.component.html',
  styleUrls: ['./system-diagnostics.component.css']
})
export class SystemDiagnosticsComponent implements OnInit {

  error: any;
  diagnosticList: any;
  reqObject: any;
  reqObject1: any;
  deleteReqObject: any;
  responseData: any;
  bsModalRef: BsModalRef;
  modalConfig: any;
  msg: string;
  tableConfig: ITableInfo;
  changeValue: any;
  showLoader: boolean = false;
  deleteFileId: string;

  constructor(private _diagnostics: AdminSystemDiagnosticsService, private _modalService: BsModalService) {
    this.modalConfig = MODAL_CONFIG.BASE_CONFIG;
  }

  ngOnInit() {
    this.showLoader = true;
    this.reqObject = this._diagnostics.getSystemDiagnosticsReqObj();
    this.reqObject1 = this._diagnostics.getSystemDiagnosticsReqObject('gather_all');

    this._diagnostics.getDiagnosticsList(this.reqObject).subscribe((data) => {
      //console.log(data);
      this.diagnosticList = data.scriptDTOs;
    }, error => this.error = error)

    this._diagnostics.getDiagnosticsTable(this.reqObject1).subscribe((response) => {
      if (response.statusCode === 0) {
        this.showLoader = false;
        this.tableConfig = this._diagnostics.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.scriptResultDTOs;
        this.tableConfig.isAsyncEventComplete = true;
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => this.error = error);
  }

  listchange(event: any) {
    this.changeValue = event.target.value;
    this.reqObject1 = this._diagnostics.getSystemDiagnosticsReqObject(this.changeValue);
  }

  diagnosticRefresh() {
    this.showLoader = true;
    this._diagnostics.refreshDiagnosticsList(this.reqObject).subscribe((response) => {
      if (response.statusCode === 0) {
        this.tableConfig = this._diagnostics.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.scriptResultDTOs;
        this.showLoader = false;
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => this.error = error);
  }

  diagnosticResult() {
    this.showLoader = true;
    this._diagnostics.getDiagnosticResult(this.reqObject1).subscribe((data) => {
      this.responseData = data;
      if (this.responseData) {
        this.showLoader = false;;
        this.messageModalDisplay(this.responseData.statusCode);
        this.bsModalRef = this._modalService.show(CustomModalComponent, this.modalConfig);
        this.getresults(this.reqObject1);
      }
    }, error => this.error = error);
  }

  getresults(reqObj) {
    this._diagnostics.getDiagnosticsTable(reqObj).subscribe((response) => {
      if (response.statusCode === 0) {
        this.tableConfig = this._diagnostics.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.scriptResultDTOs;
        this.tableConfig.isAsyncEventComplete = true;
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => this.error = error);
  }

  updateModalConfig(header: string, msg: string, type: string) {
    this.modalConfig.initialState.header = header;
    this.modalConfig.initialState.message = msg;
    this.modalConfig.initialState.type = type;
  }

  messageModalDisplay(statusCode) {
    if (statusCode === 0) {
      this.msg = "Your request is sent to the queue. Please check again in few minutes";
      this.updateModalConfig('Success', this.msg, 'success')
    }
    else if (statusCode !== 0) {
      this.msg = "Script is already running, Please try later";
      this.updateModalConfig('Error', this.msg, 'error')
    }
  }

  handleImageEvent(rowInfo) {
    this.showLoader = true;
    this.deleteFileId = rowInfo.rowItem.fileName;
    this.deleteReqObject = this._diagnostics.getSystemDiagnosticsDeleteReqObject(this.deleteFileId);

    this._diagnostics.deleteDiagnosticsTable(this.deleteReqObject).subscribe((response) => {

      if (response.statusCode === 0) {
        this.showLoader = false;
        this.updateModalConfig('Confirm', "Are you sure you want to delete this file?", 'confirm');
        this.bsModalRef = this._modalService.show(CustomModalComponent, this.modalConfig);
        this.getresults(this.deleteReqObject);
      }
    }, error => this.error = error);

  }

}
