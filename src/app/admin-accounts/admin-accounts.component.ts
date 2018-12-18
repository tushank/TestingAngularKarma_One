import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ITableInfo } from '../../customer-support/troubleshooting/matching-customer-list/custom-data-table/custom-data-table.model';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SystemEventsService } from '../../../services/administration/system-events/system-events.service';
import { adminAccountConstants } from '../../../constants/admin-account.constants';
import { HttpClientService } from '../../../services/http-client.service';
import { GlobalConstants } from '../../../constants/global-constants';


@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {
  bsModalRef: BsModalRef;
  tableConfig: ITableInfo;
  error: string;

  constructor(private httpClient: HttpClientService,
    private modalService: BsModalService,private globalConstants: GlobalConstants, 
    private _systemEventServices: SystemEventsService) { }
  @Input() tableInfo: ITableInfo;

  ngOnInit() {
    this.updateTable(1, 10);
  }

  updateTable(page, rows) {
    if (this.tableConfig) {
      this.tableConfig.isAsyncEventComplete = false;
    }

    const reqObj = this._systemEventServices.getSystemEventsReqObj(page, rows);
    this.getEventsList(reqObj).subscribe(response => {
      console.log('table list data : ', response);
      if (response.statusCode === 0 && response && response.adminAccountsDTOList) {
        this.tableConfig = this.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.adminAccountsDTOList;
        this.tableConfig.isAsyncEventComplete = true;
        console.log('this.tableConfig.rowsInfo.rowsList : ', this.tableConfig.rowsInfo.rowsList);
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => this.error = error);
  }

  getEventsList(reqObj) {
    return this.httpClient.post(this.globalConstants.FI_SERVER_BASE_URL + adminAccountConstants.LIST_ALL.URL,
      reqObj, this.globalConstants.CONTENT_TYPE_JSON, true);
  }

  getGridConfig() {
    return (adminAccountConstants.GRID_CONFIG);
  }

  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(AdminAccountDetailComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
