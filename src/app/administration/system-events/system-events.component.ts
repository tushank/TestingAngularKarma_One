import { Component, OnInit } from '@angular/core';
import { SystemEventsService } from 'src/app/services/administration/system-events/system-events.service';
import { ITableInfo } from 'src/app/shared/custom-data-table2/custom-data-table.model';
import { systemEventsConstants } from 'src/app/constants/system-events.constants';

@Component({
  selector: 'app-system-events',
  templateUrl: './system-events.component.html',
  styleUrls: ['./system-events.component.css'],
  providers: [SystemEventsService]
})
export class SystemEventsComponent implements OnInit {

  tableConfig: ITableInfo;
  error: string;

  constructor(private _systemEventServices: SystemEventsService) { }

  ngOnInit() {
    this.updateTable(1, 10);
  }

  updateTable(page, rows) {
    if (this.tableConfig) {
      this.tableConfig.isAsyncEventComplete = false;
    }

    const reqObj = this._systemEventServices.getSystemEventsReqObj(page, rows);
    this._systemEventServices.getSystemEventsList(reqObj).subscribe(response => {
      if (response.statusCode === 0) {
        this.tableConfig = this._systemEventServices.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.systemAlerts;
        this.tableConfig.totalRecords = response.total;
        this.tableConfig.currentPageNumber = page;
        this.tableConfig.itemsPerPageInfo.activeOption = rows;
        this.tableConfig.isAsyncEventComplete = true;
        this.tableConfig = Object.assign({}, this.tableConfig);
      }
    }, error => {this.error = error;
      this.tableConfig.isAsyncEventComplete = true;
    });
  }

  handlePageListChangeEvent($event) {
    this.updateTable(this.tableConfig.currentPageNumber, $event);
  }

  handleGoToFirstPageEvent($event) {
    this.updateTable(1, this.tableConfig.itemsPerPageInfo.activeOption);
  }

  handleGoToPreviousPageEvent($event) {
    this.updateTable(this.tableConfig.currentPageNumber - 1, this.tableConfig.itemsPerPageInfo.activeOption);
  }

  handleGoToNextPageEvent($event) {
    this.updateTable(this.tableConfig.currentPageNumber + 1, this.tableConfig.itemsPerPageInfo.activeOption);
  }

  handleGoToLastPageEvent($event) {
    const maxPages = Math.ceil(this.tableConfig.totalRecords / this.tableConfig.itemsPerPageInfo.activeOption);
    this.updateTable(maxPages, this.tableConfig.itemsPerPageInfo.activeOption);
  }

  handlePageNumberChangeEvent($event) {
    this.updateTable($event, this.tableConfig.itemsPerPageInfo.activeOption);
  }

  handleRefreshTableEvent($event) {
    this.updateTable(this.tableConfig.currentPageNumber, this.tableConfig.itemsPerPageInfo.activeOption);
  }


}
