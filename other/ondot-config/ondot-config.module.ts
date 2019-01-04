import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { OndotConfigComponent } from './ondot-config.component';
import { EditConfigComponent } from './edit-config/edit-config.component';
import { FormsModule } from '@angular/forms';

const routes = [
    {
        path: 'ondot-config',
        component: OndotConfigComponent
    }
];

@NgModule({
    declarations: [
        OndotConfigComponent,
        EditConfigComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild(routes),

    ],
    exports: [
        OndotConfigComponent
    ],
    entryComponents: [EditConfigComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class OndotConfigModule { }








