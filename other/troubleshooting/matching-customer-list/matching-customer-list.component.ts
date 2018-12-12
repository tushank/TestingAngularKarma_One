import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, Input, OnChanges, SimpleChanges, Output,EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ITableInfo } from './custom-data-table/custom-data-table.model';
import { customerSupportConstants } from '../../../../constants/customer-support.constants';
@Component({
  selector: 'app-matching-customer-list',
  templateUrl: './matching-customer-list.component.html',
  styleUrls: ['./matching-customer-list.component.css']
})
export class MatchingCustomerListComponent implements OnInit,OnChanges {

  @ViewChild('panelBody') panelBody: ElementRef;
  @Input()  tableInfo: ITableInfo;
  @Output('tableEvent') tableEvent: EventEmitter<any>;

  private _isPanelExpanded: boolean;
  private _rowHeight: number;

  constructor(private _renderer: Renderer2, private _changeDetector: ChangeDetectorRef) {
    this._isPanelExpanded = true;
    // this.tableInfo = val;
    this._rowHeight = 25;
    this.tableEvent = new EventEmitter<any>();
  }

  @HostListener('window:resize')
  private onWindowResize(): void{
      this._renderer.setStyle(
        this.panelBody.nativeElement, 'height', 'auto'
      );
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes && changes.tableInfo && changes.tableInfo.currentValue) {
     // console.log(changes.tableInfo.currentValue);
      this.tableInfo = changes.tableInfo.currentValue;
      this._changeDetector.detectChanges();
      this._renderer.setStyle(this.panelBody.nativeElement, 'height', 'auto');
    } 
  }

  togglePanelBody(): void {
    this._isPanelExpanded = !this._isPanelExpanded;
    if (this._isPanelExpanded) {
        this.adjustPanelHeight();
    } else {
      this._renderer.setStyle(this.panelBody.nativeElement, 'height', '0px');
    }
  }

adjustPanelHeight(timeout?) {
  
  this._renderer.setStyle(
    this.panelBody.nativeElement, 'height', this.tableInfo.rowsInfo.rowsList.length * this._rowHeight + 66 + 'px'
  );
  setTimeout(() => {
    this._renderer.setStyle(
      this.panelBody.nativeElement, 'height', 'auto'
    );
    this._renderer.setStyle(this.panelBody.nativeElement, 'height', this.panelBody.nativeElement.scrollHeight + 'px');
    
  }, timeout ? timeout : 500);
}



  handlePageListChangeEvent($event){
    this.tableEvent.emit({
        event: customerSupportConstants.GRID_EVENT_TYPES.PAGE_LIST_CHANGE,
        data: $event 
      });
  }

  handleGoToFirstPageEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.GO_TO_FIRST_PAGE,
      data: $event 
    });
  }

  handleGoToPreviousPageEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.GO_TO_PREVIOUS_PAGE,
      data: $event 
    });
  }

  handleGoToNextPageEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.GO_TO_NEXT_PAGE,
      data: $event 
    });
  }

  handleGoToLastPageEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.GO_TO_LAST_PAGE,
      data: $event 
    });
  }

  handlePageNumberChangeEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.PAGE_NUMBER_CHANGE,
      data: $event 
    });
  }

  handleRefreshTableEvent($event){
    this.tableEvent.emit({
      event: customerSupportConstants.GRID_EVENT_TYPES.REFRESH,
      data: $event 
    });
  }

  handleLinkClickEvent($event){
    // this.tableEvent.emit({
    //   event: customerSupportConstants.GRID_EVENT_TYPES.LINK_CLICK,
    //   data: $event 
    // });
  }
}



