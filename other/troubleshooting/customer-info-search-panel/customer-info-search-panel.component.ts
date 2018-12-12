import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilistDropdownService } from '../../../../services/filist-dropdown.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomModalComponent } from 'src/app/shared/custom-modal/custom-modal.component';
import { CustomerSearchConfig } from './customer-info-search.config';

@Component({
  selector: 'app-customer-info-search-panel',
  templateUrl: './customer-info-search-panel.component.html',
  styleUrls: ['./customer-info-search-panel.component.css']
})
export class CustomerInfoSearchPanelComponent implements OnInit {

  bsModalRef: BsModalRef;
  modalConfig: any;

  customerInfoForm: FormGroup;
  fiList: any[];

  @Output('submitFormEvent') submitFormEvent: EventEmitter<FormGroup>;

  constructor(private _formBuilder: FormBuilder, private filist: FilistDropdownService, private _modalService: BsModalService) {
    this.submitFormEvent = new EventEmitter<FormGroup>();
    this.fiList = filist.FI_LIST || JSON.parse(localStorage.getItem('fiList'));
    this.modalConfig = CustomerSearchConfig.MODAL_CONFIG.BASE_CONFIG;
  }

  ngOnInit() {
    this.customerInfoForm = this._formBuilder.group({
      cardNumber: ['', [Validators.pattern('[0-9]{0,4}')]],
      accountNumber: ['', [Validators.pattern('[0-9]{0,4}')]],
      customerName: [''],
      customerId: [''],
      subscriberID: [''],
      subscriberRefId: [''],
      searchByFIId: [''],
    });
    this.updateFiId('ALL');
  }


  submitCustomerInfo(): void {
    if (this.validateForm()) {
      this.submitFormEvent.emit(this.customerInfoForm);
    } else {
      this.bsModalRef = this._modalService.show(CustomModalComponent, this.modalConfig);
    }
  }

  validateForm(): boolean {
    if (this.validateRequiredFields() &&
      this.validateInvalidCardNumber() &&
      this.validateAccountNumber() &&
      this.validateCustomerName()) {
      return true;
    }
    return false;
  }

  validateRequiredFields(): boolean {
    if (this.customerInfoForm.controls['cardNumber'].value.length > 0 ||
      this.customerInfoForm.controls['accountNumber'].value.length > 0 ||
      this.customerInfoForm.controls['customerName'].value.length > 0 ||
      this.customerInfoForm.controls['customerId'].value.length > 0 ||
      this.customerInfoForm.controls['subscriberRefId'].value.length > 0) {
      return true;
    } else {
      this.modalConfig.initialState.header = 'Error';
      this.modalConfig.initialState.message = CustomerSearchConfig.MODAL_CONFIG.MESSAGES.REQUIRED_MSG;
      this.modalConfig.initialState.type = 'error';
      return false;
    }
  }

  validateInvalidCardNumber(): boolean {
    if (this.customerInfoForm.controls['cardNumber'].invalid) {
      this.modalConfig.initialState.header = 'Error';
      this.modalConfig.initialState.message = CustomerSearchConfig.MODAL_CONFIG.MESSAGES.INVALID_CARD_NUM_MSG;
      this.modalConfig.initialState.type = 'error';
    }
    return this.customerInfoForm.controls['cardNumber'].valid;
  }

  validateAccountNumber(): boolean {
    if (this.customerInfoForm.controls['accountNumber'].invalid) {
      this.modalConfig.initialState.header = 'Error';
      this.modalConfig.initialState.message = CustomerSearchConfig.MODAL_CONFIG.MESSAGES.INVALID_ACC_NUM_MSG;
      this.modalConfig.initialState.type = 'error';
    }
    return this.customerInfoForm.controls['accountNumber'].valid;
  }

  validateCustomerName(): boolean {
    if (this.customerInfoForm.controls['customerName'].value.length > 0) {
      if (this.customerInfoForm.controls['cardNumber'].value.length > 0) {
        return true;
      } else {
        this.modalConfig.initialState.header = 'Error';
        this.modalConfig.initialState.message = CustomerSearchConfig.MODAL_CONFIG.MESSAGES.CARD_NUM_NAME_REQ_MSG;
        this.modalConfig.initialState.type = 'error';
        return false;
      }
    } else {
      return true;
    }
  }

  updateFiId(value): void {
    const fiVal = this.fiList.find(x => x['fiName'] === value);
    if (fiVal) {
      this.customerInfoForm.controls['searchByFIId'].setValue(String(fiVal['fiId']));
    } else {
      this.customerInfoForm.controls['searchByFIId'].setValue('');
    }
    if (this.customerInfoForm.controls['searchByFIId'].value === '-1') {
      let fiId = '';
      this.fiList.forEach((fiValue, index) => {
        if (fiValue['fiId'] !== -1) {
          const suffix = index !== (this.fiList.length - 1) ? ',' : '';
          fiId += fiValue['fiId'] + suffix;
        }
      });
      this.customerInfoForm.controls['searchByFIId'].setValue(fiId);
    }
  }

}
