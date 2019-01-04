import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatDialogRef } from '@angular/material';
import { IEditConfig } from './edit-config';
import { NgForm } from '@angular/forms';
import { OndotConfigService } from '../../services/ondot-config/ondot-config.service';

@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-config.component.html',
  styleUrls: ['./edit-config.component.scss'],
  providers: [MatSnackBar]
})
export class EditConfigComponent implements OnInit {
  @ViewChild('signupForm') signupForm: NgForm;
  ondotConfigData: IEditConfig;
  error: string;
  END_NOW_MSG = 'End now';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  UPDATE_RECORD_MSG = 'Update Record successfully !';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _ondotConfigService: OndotConfigService, public snackBar: MatSnackBar
  , public dialogRef: MatDialogRef<EditConfigComponent>) { }

  ngOnInit(): void {
    if (this.data) {
      this.ondotConfigData = this.data;
      this.ondotConfigData.encrypt = false;
      console.log('ondotConfigData : ', this.ondotConfigData);
    }
  }

  onSubmit(): void {
    const reqObj = {
      IP: 'localhost',
      SessionID: localStorage.getItem('sessionID'),
      configId: this.ondotConfigData.configId,
      parameterValue: this.signupForm.value.parameterValue,
      encrypt: this.signupForm.value.encrypt
    };
    console.log('reqObj : ', reqObj);
    console.log('signform', this.signupForm);
    this._ondotConfigService.editOndotConfig(reqObj).subscribe((response: any) => {
      if (response.statusCode === 0) {
        this.dialogRef.close();
        this.signupForm.reset();
        this.openSnackBar(this.UPDATE_RECORD_MSG);
        
          
      }
    }, error => this.error = error);
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, this.END_NOW_MSG, {
      duration: 2000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
