import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpConf } from 'src/app/core/http/http.conf';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { SnackBarService } from 'src/app/core/services/ui/snack-bar.service';

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.scss']
})
export class CustomerUpdateComponent implements OnInit {

  customerUpInitForm!: FormGroup;
  customerList;

  loading: boolean = false;
  currentUser = this.authService.getCurrentUser();

  constructor(
    public dialogRef: MatDialogRef<CustomerUpdateComponent>,
    private formBuilder: FormBuilder,
    private coreService: CoreService,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.initCustomerUpInitForm(); 
  }

  initCustomerUpInitForm(): void {
    this.customerUpInitForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      password: ['defaultPassword'],
      surname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      role: ["ROLE_USER"],
      userId: [this.currentUser.id]
    });

    if (this.data) {
      this.customerUpInitForm.removeControl('password');
      this.setCustomerUpInitForm();
    }
  }

  setCustomerUpInitForm(): void {
    this.customerUpInitForm.patchValue({
      id: this.data.id,
      surname: this.data.surname,
      name: this.data.name,
      email: this.data.email,
    });
  }


  submit(): void {
    this.customerUpInitForm.disable();
    this.loading = true;

    const body = {
      ...this.data,
      ...this.customerUpInitForm.value
    };


    if (this.data) {
      this.updateCustomer(body);
    } else {
      delete body.id;
      this.createCustomer(body);
    }
  }

  createCustomer(body): void {
    this.coreService.post(HttpConf.URL.customers, body)
      .subscribe(() => {
        this.dialogRef.close({ created: true });
      }, (err: HttpErrorResponse) => {
        this.snackBarService.error(err);
        this.customerUpInitForm.enable();
        this.loading = false;
      });
  }

  updateCustomer(body): void {
    delete body.password;

    this.coreService.put(HttpConf.URL.customers, body)
      .subscribe(() => {
        this.dialogRef.close({ created: false });
      }, (err: HttpErrorResponse) => {
        this.snackBarService.error(err);
        this.customerUpInitForm.enable();
        this.loading = false;
      });
  }

}
