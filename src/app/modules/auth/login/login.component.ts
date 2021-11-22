import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Authority } from 'src/app/core/enums/authority.enum';
import { HttpConf } from 'src/app/core/http/http.conf';
import { CoreService } from 'src/app/core/services/core.service';
import { SnackBarService } from 'src/app/core/services/ui/snack-bar.service';
import { UiService } from 'src/app/core/services/ui/ui.service';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginLoading = false;

  constructor(
    private authService: AuthService, 
    private coreService: CoreService,
    private snackBarService: SnackBarService,
    private formBuilder: FormBuilder,
    private uiService: UiService
) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      email: [null],
      password: [null, [Validators.required, Validators.minLength(3)]],
      role: ['ROLE_ADMIN', [Validators.required]],
      rememberMe: [false]
    });
  }

  changeRole(e: any) {
    console.log(e);
    if (this.loginForm.get('role')?.value === Authority.ROLE_USER) {
      this.loginForm.get('email')?.setValidators([Validators.email, Validators.required])
      this.loginForm.get('username')?.clearValidators();
    } else {
      this.loginForm.get('username')?.setValidators([Validators.required])
      this.loginForm.get('email')?.clearValidators();
    }

    this.loginForm.get('email')?.updateValueAndValidity();
    this.loginForm.get('username')?.updateValueAndValidity();
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const body = this.loginForm.value;
    let url: string = '';

    this.loginForm.disable();
    this.loginLoading = true;


    if (body.role === 'ROLE_USER') {
      delete body.username
      url = HttpConf.URL.login_customer;
    } else {
      delete body.email
      url = HttpConf.URL.auth;
    }


    this.loginForm.disable();
    this.loginLoading = true;

    this.authService.login(this.loginForm.value, url)
    .subscribe(res => {
      this.authService.setDeliveryAuthData(res.id_token);
      this.authService.setToken(res.id_token);
      this.authService.setCurrentUser(res);
      this.checkAuthoritiesAndRedirect();
    }, err => {
      this.snackBarService.error(err);
      this.loginForm.enable();
      this.loginLoading = false;
    });

  }

   checkAuthoritiesAndRedirect(): void {
    const auth = this.authService.getAuthorities();
    let route = '/';

    if (auth.role === Authority.ROLE_USER ) {
      route += 'task';
    }

    this.uiService.routeWithDelay([route], 'Login');
  }

}
