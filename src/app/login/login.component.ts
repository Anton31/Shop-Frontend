import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../service/auth-service";
import {UserService} from "../service/user-service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "../register/register.component";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  userForm!: FormGroup;
  username!: string;
  email!: string;
  role!: string;

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.authService.userSubject.subscribe(data => {
      this.username = data.username;
      this.role = data.role;
      this.email = data.email;
    })
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
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      role: [this.role],
      username: [this.username],
      email: [this.email],
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
