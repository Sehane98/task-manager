import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Authority } from 'src/app/core/enums/authority.enum';
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
      organizationName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      username: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
      role: ['ROLE_ADMIN', [Validators.required]],
    });
  }

  submit(): void {  
    if (this.loginForm.invalid) {
      return;
    }

    this.loginForm.disable();
    this.loginLoading = true;

    this.coreService.post(HttpConf.URL.registration, this.loginForm.value).subscribe(
      (res) => {
        this.authService.setDeliveryAuthData(res.id_token);
        this.authService.setToken(res.id_token);
        this.authService.setCurrentUser(res);
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
    
    if (auth.role === Authority.ROLE_USER ) {
      route += 'task';
    }

    this.uiService.routeWithDelay([route], 'Successfully registered');
  }
}
