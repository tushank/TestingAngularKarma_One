import { Component, OnInit,Injectable } from '@angular/core';
import {MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {of as ofObservable, Observable, BehaviorSubject} from 'rxjs';

import { GlobalConstants } from '../../../../constants/global-constants';
import { AdminGroupService } from '../../../../services/admin-group.service';
import { ChecklistDatabase } from '../checklistDatabaseservice';


const TREE_DATA = {
  
  'Access Privilege': {
    'Dashboard': {
      'Monthly': null,
      'Weekly': null,          
    },
    'Customer Support': {
      'Customer Troubleshooting':null,
      'Reset Registration State':null,
      'Customer Details':null,
      'On Behalf Of':null,
      'Activity Viewer':null,
      'Register New User':null,
      'Manage Cards':null,
      'Manage Preferences':null,
      'Enable/Disable Account':null,
      'Unsubscribe User':null,
      'Update Contact Email Address':null,
      'Test Push Notification':null      
    },
    'Reports': {
      'View Generated Report':null,
      'View Scheduled Report':null,
      'Create Report':null,
      'Create Detailed Report - I':null,
      'Create Detailed Report - II':null
    },
    'Administration': {
      'Admin Groups':null,
      'Admin Accounts':null,
      'System Topology':null,
      'System Diagnostics':null,
      'System Messages':null,
      'System Events':null,
      'Credentials':null,
      'Billing File':null,
      'Ondot Config':null,
      'Job Scheduler':null
    },
    'FI Onboarding': {
      'FI List': null,
      'FI Contact Details & App Config': null,
      'App Branding': null,
      'Issuer Systems': null,
      'App List': null,
      'Manage Apps': null,
      'Manage Features': null,
      'Advanced Settings': null
    },
    'FI Config View': {
      'FI Config View':null
    },
    'Unsubscribed Users': {
      'Unsubscribed Users':null
    },
    'Transaction Authorization Alerts': {
      'FI Enrollment':null,
      'Customer Troubleshooting':null,
      'Job Status':null
    }
  }
};




export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

@Component({
  selector: 'app-tree-checklist-example',
  templateUrl: './tree-checklist-example.component.html',
  styleUrls: ['./tree-checklist-example.component.css'],
  providers: [ChecklistDatabase]

})
export class TreeChecklistExampleComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName: string = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  
  constructor(
    private database: ChecklistDatabase, private globalConstants: GlobalConstants,
    private adminGroupService: AdminGroupService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.database.initialize(TREE_DATA);
    this.getDetails();
  }
  getDetails(){
    this.adminGroupService
            .getPrivileges()
            .subscribe((res) => {
              console.log('res',res);
            }, () => {
              
            });
  }
  //  this.adminGroupService.getPrivileges().subscribe((data: any) => {
    
  //  }, error => this.error = error);
  
  getLevel = (node: TodoItemFlatNode) => { return node.level; };

  isExpandable = (node: TodoItemFlatNode) => { return node.expandable; };

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.children);
  }

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.item === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.item === node.item
      ? this.nestedNodeMap.get(node)!
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

}
