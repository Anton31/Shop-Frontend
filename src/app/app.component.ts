import {Component, inject} from "@angular/core";


import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "./register/register.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserService} from "./service/user-service";

import {UserInfo} from "./dto/user-info";
import {Observable} from "rxjs";
import {AuthService} from "./service/auth-service";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {RouterModule} from "@angular/router";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    AsyncPipe
  ]
})
export class AppComponent {
  userForm!: FormGroup;
  user!: Observable<UserInfo>;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.user = this.authService.userSubject.pipe();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  addUser() {
    this.userForm = this.fb.group({
      role: ['user'],
      username: [''],
      email: [''],
      password: [''],
      passwordConfirmed: [''],
    })
    this.dialog.open(RegisterComponent, {
      height: '600px',
      width: '500px',
      data: {userForm: this.userForm, new: true}
    }).afterClosed().subscribe(data => {
      if (data) {
        this.userService.addUser(data).subscribe({
          next: (data2) => {
            this.snackBar.open(data2.message, '', {duration: 3000})
          },
          error: (err) => {
            this.snackBar.open(err.error.message, '', {duration: 3000})
          }
        });
      }
    });
  }

  editUser() {
    this.userForm = this.fb.group({
      role: ['user'],
      password: [''],
      passwordConfirmed: [''],
    })
    this.dialog.open(RegisterComponent, {
      height: '600px',
      width: '500px',
      data: {userForm: this.userForm, new: false}
    }).afterClosed().subscribe(data => {
      this.userService.editUser(data).subscribe({
        next: (data2) => {
          this.snackBar.open(data2.message, '', {duration: 3000})
        },
        error: (err) => {
          this.snackBar.open(err.error.message, '', {duration: 3000})
        }
      });
    });
  }
}
