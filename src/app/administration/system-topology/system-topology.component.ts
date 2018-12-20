import { Component, OnInit } from '@angular/core';
import { ITableConfig } from 'src/app/shared/fixed-header-data-grid/fixed-header-data-grid.model';
import { SystemTopologyService } from 'src/app/services/administration/system-topology/system-topology.service';
import { ITableInfo } from 'src/app/shared/custom-data-table2/custom-data-table.model';

@Component({
  selector: 'app-system-topology',
  templateUrl: './system-topology.component.html',
  styleUrls: ['./system-topology.component.css']
})
export class SystemTopologyComponent implements OnInit {

  componentTableConfig: ITableConfig;
  virtualHostsTableConfig: ITableConfig;
  physicalHostsTableConfig: ITableInfo;
  interfacesSetupTableConfig: ITableConfig;
  constructor(private _systemTopologyService: SystemTopologyService) { }

  ngOnInit() {
    this.getSystemTopology();
  }

  getSystemTopology() {
    const reqObj = this._systemTopologyService.getSystemTopologyReqObj();
    this._systemTopologyService.getSystemTopologyList(reqObj).subscribe((response) => {
      if (response.statusCode === 0) {
        this.updateComponentTableConfig(response.componentDTOList);
        this.updateInterfacesSetupTableConfig(response.interfacesSetupDTOList);
        this.updatePhysicalHostsTableConfig(response.physicalHostsDTOList);
        this.updateVirtualHostsTableConfig(response.virtualHostsDTOList);
      }
    }, (error) => {

    });
  }


  updateComponentTableConfig(list: Array<any>) {
    this.componentTableConfig = this._systemTopologyService.getComponentGridConfig();
    this.componentTableConfig.rowsInfo.rowsList = list;
    this.componentTableConfig = Object.assign({}, this.componentTableConfig);
  }


  updatePhysicalHostsTableConfig(list: Array<any>) {
    this.physicalHostsTableConfig = this._systemTopologyService.getPhysicalHostsGridConfig();
    this.physicalHostsTableConfig.rowsInfo.rowsList = list;
    this.physicalHostsTableConfig = Object.assign({}, this.physicalHostsTableConfig);
  }


  updateVirtualHostsTableConfig(list: Array<any>) {
    this.virtualHostsTableConfig = this._systemTopologyService.getVirtualHostsGridConfig();
    this.virtualHostsTableConfig.rowsInfo.rowsList = list;
    this.virtualHostsTableConfig = Object.assign({}, this.virtualHostsTableConfig);
  }

  updateInterfacesSetupTableConfig(list: Array<any>) {
    this.interfacesSetupTableConfig = this._systemTopologyService.getInterfacesSetupGridConfig();
    this.interfacesSetupTableConfig.rowsInfo.rowsList = list;
    this.interfacesSetupTableConfig = Object.assign({}, this.interfacesSetupTableConfig);
  }
}
