import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { AuthLayoutComponent } from "./containers/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./containers/main-layout/main-layout.component";

@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
})
export class SharedModule { }
