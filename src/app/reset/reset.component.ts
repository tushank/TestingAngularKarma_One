import { Component } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'src/app/constants/global-constants';
import { MODAL_CONFIG } from '../../../shared/config/custom-modal.config';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {

  private resetResponseData: any = {};
  error: string;
  bsModalRef: BsModalRef;
  modalConfig: any;

  constructor(private http: HttpClient, private globalConstants: GlobalConstants,
    private _modalService: BsModalService) {
    this.modalConfig = MODAL_CONFIG.BASE_CONFIG;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, x-auth'
    })
  };

  reset(cardDetails) {

    const requestData = {
      SessionID: localStorage.getItem('sessionID'),
      IP: window.location.hostname,
      CardNumber: cardDetails.cardNo
    };

    return this.http.post(
      this.globalConstants.FI_SERVER_BASE_URL + '/mc/csr/cardReset.do',
      requestData, this.httpOptions).subscribe((data: any) => {
        //console.log(data);
        if (data) {
          this.resetResponseData = data;
          this.updateModalConfig('Error', this.resetResponseData.messageDisplay, 'error')
          this.bsModalRef = this._modalService.show(CustomModalComponent, this.modalConfig);
        }
      }, error => this.error = error);
  }

  updateModalConfig(header: string, msg: string, type: string) {
    this.modalConfig.initialState.header = header;
    this.modalConfig.initialState.message = msg;
    this.modalConfig.initialState.type = type;
  }
}
