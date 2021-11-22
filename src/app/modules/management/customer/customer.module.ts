import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerUpdateComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    DragDropModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    CustomerUpdateComponent,
    ConfirmDeleteComponent
  ]
})
export class CustomerModule { }
