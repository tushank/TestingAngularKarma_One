import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminAccountCommunicationService {

  private refreshTable = new Subject();
  private messageSource = new BehaviorSubject<any>('');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  getRefreshAccountTable(): Observable<any>{
    return this.refreshTable.asObservable();
  }

  refreshAccountTable() {
    this.refreshTable.next(1);
  }
}
