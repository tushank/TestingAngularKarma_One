import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { SharedModule } from 'app/shared/shared.module';

import { AdminAccountsComponent } from './admin-accounts.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule } from '../../../../../node_modules/@angular/material';
import { AdminAccountDetailComponent } from './admin-account-detail/admin-account-detail.component';

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
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        AdminAccountsComponent
    ],
    entryComponents: [AdminAccountDetailComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminAccountsModule {
}


