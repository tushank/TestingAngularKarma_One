import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddAdminGroupComponent } from './add-admin-group/add-admin-group.component';
import { AdminGroupService } from '../../../services/admin-group.service';
import { ITableInfo } from 'src/app/shared/custom-data-table2/custom-data-table.model';


@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.css']
})
export class AdminGroupsComponent implements OnInit {
  bsModalRef: BsModalRef;
  tableConfig: ITableInfo;
  error: string;
  constructor(private modalService: BsModalService, private adminGroupService: AdminGroupService) { }

  @Input() tableInfo: ITableInfo;


  ngOnInit() {
    this.getList();
  }
  getList() {
    if (this.tableConfig) {
      this.tableConfig.isAsyncEventComplete = false;
    }

    this.adminGroupService.getAdminGroupList().subscribe(response => {
      if (response.statusCode === 0) {
        this.tableConfig = this.adminGroupService.getGridConfig();
        this.tableConfig.rowsInfo.rowsList = response.adminGroupsDTOList;
        this.tableConfig.isAsyncEventComplete = true;
        this.tableConfig = Object.assign({}, this.tableConfig)
      }
    }, (err) => {
      this.tableConfig.isAsyncEventComplete = true;
    });
  }
  openModalWithComponent() {
    this.bsModalRef = this.modalService.show(AddAdminGroupComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
