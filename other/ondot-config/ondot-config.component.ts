import { Component, OnInit } from '@angular/core';
import { ICustomMatTableConfig } from '../../../shared/components/custom-mat-table/custom-mat-table.model';
import { MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { GlobalConstants } from '../../../constants/global-constants';
import { OndotConfigService } from '../services/ondot-config/ondot-config.service';
import { EditConfigComponent } from './edit-config/edit-config.component';
import { NgForm } from '@angular/forms';
import { OndotConfig } from './ondot-config';
import { ondotConfigConstants } from '../../../constants/ondot-config.constants';

@Component({
  selector: 'app-ondot-config',
  templateUrl: './ondot-config.component.html',
  styleUrls: ['./ondot-config.component.css'],
  providers: [MatDialog, MatSnackBar]
})
export class OndotConfigComponent implements OnInit {
  ondotConfigTableConfig: ICustomMatTableConfig;
  ondotConfigTableData: any[];
  EDIT = 'Edit';
  ondotConfig = new OndotConfig();

  constructor(public dialog: MatDialog, private globalConstants: GlobalConstants, public snackBar: MatSnackBar,
  private _ondotConfigService: OndotConfigService) { }

  ngOnInit(): void {
    this.getTableConfigurations();
  }

  getTableConfigurations(): void {
    this.ondotConfigTableConfig = this._ondotConfigService.getOndotConfigGridConfig();
  }

  getOndotConfigData(reqObj): void {
    this._ondotConfigService.getOndotConfigList(reqObj).subscribe((response) => {
      if (response.statusCode === 0) {
        console.log(response);
        this.updateOndotConfigTableData(response.ondotConfigDTOList);
      }
    }, (error) => {

    });
  }

  updateOndotConfigTableData(list: Array<any>): void {
    this.ondotConfigTableData = Object.assign([], list);
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.ondotConfigTableData[0];
    dialogConfig.width = '900px';
    const dialogRef = this.dialog.open(EditConfigComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  handleEvent($event): any {
    const eventObj = $event;
    if (eventObj.link === this.EDIT) {
      this.openDialog();      
    }

  }

  getOndotConfigSerchReqObj(searchParamName): any {
    const reqObj = ondotConfigConstants.SEARCH_CONFIG.REQ_OBJ;
    reqObj.SessionID = localStorage.getItem('sessionID');
    reqObj.paramName = searchParamName;
    return reqObj;
  }

  onSubmit(ondotConfigForm: NgForm): void {
    const searchReq = ondotConfigForm.form.value.search;
    const serachRequestObj = this.getOndotConfigSerchReqObj(searchReq);
    this.getOndotConfigData(serachRequestObj);
  }

}
