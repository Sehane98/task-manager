import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SnackBarService } from 'src/app/core/services/ui/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { HttpConf } from 'src/app/core/http/http.conf';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { CustomerUpdateComponent } from '../customer-update/customer-update.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  columns: string[] = ['id', 'name', 'surname', 'email', 'actions'];
  dataSource = [];
  row;

  customerFilterForm!: FormGroup;
  tableLoading: boolean = false;
  currentUser = this.authService.getCurrentUser();

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private coreService: CoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initCustomerFilterForm();
    this.getAllCustomers();
  }

  getAllCustomers(): void {
    const params = { ...this.customerFilterForm.value };

    this.tableLoading = true;

    this.coreService
      .get(HttpConf.URL.customers, params)
      .subscribe(
        (res) => {
          this.dataSource = res.body;
        },
        (err: HttpErrorResponse) => {
          this.snackBarService.error(err);
        }
      )
      .add(() => (this.tableLoading = false));
  }

  initCustomerFilterForm(): void {
    this.customerFilterForm = this.formBuilder.group({
      count: [0],
      page: [0],
      sort: ['id,desc'],
      size: [15],
      userId: [this.currentUser.id],
    });

    this.subscribeFilterForm();
  }

  subscribeFilterForm(): void {
    this.customerFilterForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.getAllCustomers();
      });
  }

  upInit(row?): void {
    const dialogRef = this.dialog.open(CustomerUpdateComponent, {
      width: 'auto',
      height: 'auto',
      data: row ? row : null,
      maxWidth: '400px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe((res) => {
        if (res.created) {
          this.snackBarService.success('Customer successfully created');
        } else {
          this.snackBarService.success('Customer successfully updated');
        }
        this.getAllCustomers();
      });
  }

  openDeleteConfirmDialog(row) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: {
        id: row.id,
        message: 'Are you sure?',
        delete: (id: number) => this.coreService.delete(HttpConf.URL.customers + '/' + row.id, row.id)
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter((v) => !!v))
      .subscribe(() => {
        this.snackBarService.success('Successfully deleted!');
        this.getAllCustomers();
      });
  }
}
