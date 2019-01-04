import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SharedModule } from '../../../shared/shared.module';

import { AdminAccountsComponent } from './admin-accounts.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

const routes = [
    {
        path: 'admin-accounts',
        component: AdminAccountsComponent
    }
];

@NgModule({
    declarations: [
        AdminAccountsComponent,
        AdminAccountDetailComponent        
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,      
        RouterModule.forChild(routes)
    ],
    exports: [
        AdminAccountsComponent
    ],
    entryComponents: [AdminAccountDetailComponent, FuseConfirmDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminAccountsModule {
}



