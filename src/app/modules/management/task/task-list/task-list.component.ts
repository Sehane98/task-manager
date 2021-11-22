import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SnackBarService } from 'src/app/core/services/ui/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core.service';
import { HttpConf } from 'src/app/core/http/http.conf';
import { TaskUpdateComponent } from '../task-update/task-update.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  statusList = ['URGENT', 'HIGH', 'NORMAL', 'LOW'];
  columns: string[] = ['id', 'title', 'description', 'status', 'deadline', 'actions'];
  dataSource = [];
  customerList: any;

  taskFilterForm!: FormGroup;
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
  ) { }

  ngOnInit() {
    this.initTaskFilterForm();
    this.getAllTasks();
    this.getAllCustomers();

  }

  getAllTasks(): void {
    const params = { ...this.taskFilterForm.value };

    this.tableLoading = true;

    this.coreService.get(HttpConf.URL.tasks, params)
      .subscribe(res => {
        this.dataSource = res.body;
      }, (err: HttpErrorResponse) => {
        this.snackBarService.error(err);
      }).add(() => this.tableLoading = false);
  }

  getAllCustomers(): void {
    this.coreService.get(HttpConf.URL.customers)
      .subscribe(res => {
        this.customerList = res.body;
      }, (err: HttpErrorResponse) => {
        this.snackBarService.error(err);
      });
  }

  initTaskFilterForm(): void {
    this.taskFilterForm = this.formBuilder.group({
      count: [0],
      page: [0],
      sort: ['id,desc'],
      size: [15],
      customer: [null],
      status: [null],
      userId: [this.currentUser.id]
    });

    this.subscribeFilterForm();
  }


  subscribeFilterForm(): void {
    this.taskFilterForm.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.getAllTasks();
      });
  }

  upInit(row?): void {
    const dialogRef = this.dialog.open(TaskUpdateComponent, {
      width: 'auto',
      height: 'auto',
      data: row ? row : null,
      maxWidth: '400px'
    });

    dialogRef.afterClosed()
      .pipe(
        filter(v => !!v)
      )
      .subscribe(res => {
        if (res.created) {
          this.snackBarService.success('Task successfully created');
        } else {
          this.snackBarService.success('Task successfully updated');
        }
        this.getAllTasks();
      });
  }

  openDeleteConfirmDialog(row) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '350px',
      height: 'auto',
      data: {
        id: row.id,
        message: 'Are you sure?',
        delete: (id: number) => this.coreService.delete(HttpConf.URL.tasks + '/' + row.id, row.id)
      }
    });

    dialogRef.afterClosed()
      .pipe(
        filter(v => !!v)
      )
      .subscribe(() => {
        this.snackBarService.success('Successfully deleted!');
        this.getAllTasks();
      });
  }

}
