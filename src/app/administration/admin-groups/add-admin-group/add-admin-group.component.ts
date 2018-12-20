import { Component, OnInit, Input} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AdminGroupService } from '../../../../services/admin-group.service';


@Component({
  selector: 'app-add-admin-group',
  templateUrl: './add-admin-group.component.html',
  styleUrls: ['./add-admin-group.component.css']
})
export class AddAdminGroupComponent implements OnInit {

  

  fmdAddAdminGroup: FormGroup;
  
  
  constructor(private modalService: BsModalService, public bsModalRef: BsModalRef,private adminGroupService:AdminGroupService) { }
  
  ngOnInit() {
    this.fmdAddAdminGroup = new FormGroup({
      groupName: new FormControl('', [
        Validators.required        
      ])
    });
  
  }
  addGroup(){
    if (this.fmdAddAdminGroup.valid) {
      this.adminGroupService.addGroup();
    }

  }

  
}
