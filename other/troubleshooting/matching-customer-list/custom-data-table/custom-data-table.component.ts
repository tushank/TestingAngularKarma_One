import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ITableInfo, IRowInfo } from './custom-data-table.model';

@Component({
  selector: 'app-custom-data-table',
  templateUrl: './custom-data-table.component.html',
  styleUrls: ['./custom-data-table.component.css']
})
export class CustomDataTableComponent implements OnInit, OnChanges {
  @Input('tableInfo') tableInfo: ITableInfo;
  @Output() pageListChangeEvent: EventEmitter<number>;
  @Output() goToFirstPageEvent: EventEmitter<boolean>;
  @Output() goToPreviousPageEvent: EventEmitter<boolean>;
  @Output() goToNextPageEvent: EventEmitter<boolean>;
  @Output() goToLastPageEvent: EventEmitter<boolean>;
  @Output() pageNumberChangeEvent: EventEmitter<number>;
  @Output() refreshTableEvent: EventEmitter<boolean>;
  @Output() linkClickEvent: EventEmitter<any>;

  backwardPageControlDisabled: boolean;
  forwardPageControlDisabled: boolean;
  maxPages: number;
  selectedItem: any;

  constructor() {
    this.pageListChangeEvent = new EventEmitter<number>();
    this.goToFirstPageEvent = new EventEmitter<boolean>();
    this.goToPreviousPageEvent = new EventEmitter<boolean>();
    this.goToNextPageEvent = new EventEmitter<boolean>();
    this.goToLastPageEvent = new EventEmitter<boolean>();
    this.pageNumberChangeEvent = new EventEmitter<number>();
    this.refreshTableEvent = new EventEmitter<boolean>();
    this.linkClickEvent = new EventEmitter<any>();
    this.backwardPageControlDisabled = true;
    this.forwardPageControlDisabled = false;
  }

  ngOnInit() {
    this.calculateMaxPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.tableInfo && changes.tableInfo.currentValue) {
      this.calculateMaxPages();
    }
  }


  calculateMaxPages() {
    this.maxPages = Math.ceil(this.tableInfo.totalRecords / this.tableInfo.itemsPerPageInfo.activeOption) || 1;
  }

  clickedLink(link: string, rowItem: IRowInfo): void {
    this.linkClickEvent.emit({ link, rowItem });
    this.calculateMaxPages();
  }

  goToFirstPage(): void {
    this.goToFirstPageEvent.emit(true);
    this.calculateMaxPages();
    this.selectedItem = null;
  }

  goToPreviousPage(): void {
    this.goToPreviousPageEvent.emit(true);
    this.calculateMaxPages();
    this.selectedItem = null;
  }

  goToNextPage(): void {
    this.goToNextPageEvent.emit(true);
    this.calculateMaxPages();
    this.selectedItem = null;
  }

  goToLastPage(): void {
    this.goToLastPageEvent.emit(true);
    this.calculateMaxPages();
    this.selectedItem = null;
  }

  refreshTable(): void {
    this.refreshTableEvent.emit(true);
    this.calculateMaxPages();
    this.selectedItem = null;
  }

  pageNumberChange($event): void {
    if ($event.target.value > 0 && $event.target.value <= this.maxPages
      && this.tableInfo.currentPageNumber !== Number($event.target.value)) {
      this.pageNumberChangeEvent.emit($event.target.value);
      this.calculateMaxPages();
      this.selectedItem = null;
    } else {
      $event.target.value = this.tableInfo.currentPageNumber;
    }
  }

  pageListChange($event): void {
    this.pageListChangeEvent.emit($event.target.value);
    this.calculateMaxPages();
  }


  selectRow(rowItem) {
    this.selectedItem = rowItem;
  }

  isSelectedRow(rowItem) {
    let result = false;
    if (this.selectedItem) {
      result = true;
      for (const prop in this.selectedItem) {
        if (typeof (prop) !== 'object' && this.selectedItem[prop] === rowItem[prop]) {
          continue;
        } else {
          result = typeof (prop) !== 'object' ? false : result;
        }
      }
    } else {
      result = false;
    }
    return result;
  }

}
