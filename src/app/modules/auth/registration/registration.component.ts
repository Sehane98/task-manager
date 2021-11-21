import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpConf } from 'src/app/core/http/http.conf';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoreService } from 'src/app/core/services/core.service';
import { SnackBarService } from 'src/app/core/services/ui/snack-bar.service';
import { UiService } from 'src/app/core/services/ui/ui.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  loginForm!: FormGroup;
  loginLoading = false;

  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private snackBarService: SnackBarService,
    private formBuilder: FormBuilder,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_ADMIN', [Validators.required]],
      rememberMe: [false],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      return;
    }console.log('here')

    this.loginForm.disable();
    this.loginLoading = true;

    this.coreService.post(HttpConf.URL.registration, this.loginForm.value).subscribe(
      (res) => {
        this.authService.setDeliveryAuthData(res.id_token);
        this.authService.setToken(res.id_token);
        this.checkAuthoritiesAndRedirect();
      },
      (err) => {
        this.snackBarService.error(err);
        this.loginForm.enable();
        this.loginLoading = false;
      }
    );
  }

  checkAuthoritiesAndRedirect(): void {
    const auth = this.authService.getAuthorities();
    let route = '/';

    this.uiService.routeWithDelay([route], 'Successfully registered');
  }
}
