import {Component, OnInit, signal} from '@angular/core';
import {UserDto} from "../dto/userDto";
import {UserService} from "../service/userService";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RegisterComponent} from "../register/register.component";
import {AuthGoogleService} from "../service/authGoogleService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false
})
export class LoginComponent implements OnInit {
  isLoggedIn: string | null = null;
  dto: UserDto;
  username!: string;
  role!: string;
  googleId = signal<any>(null);
  profile = this.authService.profile;

  constructor(private userService: UserService,
              private authService: AuthGoogleService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.dto = new UserDto('', '', '', '', '', '');
  }

  reload() {
    window.location.reload();
  }

  login() {
    window.location.href = 'http://localhost:8080/oauth2/authorize?response_type=code&client_id=app-client';
  }

  signInWithGoogle() {
    this.authService.login();

  }

  googleLogout() {
    this.authService.logout();
    this.userService.clearData();
    window.location.href = '/';
  }

  logout() {
    this.userService.clearData();
    window.location.href = "http://localhost:8080/logout";
    window.location.href = '/';
  }

  getUser() {
    this.userService.getUser().subscribe(data => {
        this.username = data.username;
        this.role = data.role;
        this.userService.saveRole(this.role);
      }
    )
  }

  addUser() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: '500px',
      width: '500px',
      data: {user: this.dto, new: true}
    }).afterClosed().subscribe(data => {
      this.userService.addUser(data).subscribe(data2 => {
          this.snackBar.open(data2.message, 'undo', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, 'undo', {duration: 3000})
        })
    })
  }

  editUser() {
    this.dto.username = this.username;
    const dialogRef = this.dialog.open(RegisterComponent, {
      height: '500px',
      width: '500px',
      data: {user: this.dto, new: false}
    }).afterClosed().subscribe(data => {
      this.userService.editUser(data).subscribe(data2 => {
          this.snackBar.open(data2.message, 'undo', {duration: 3000})
        },
        err => {
          this.snackBar.open(err.error.message, 'undo', {duration: 3000})
        })
    })
  }

  ngOnInit(): void {
    this.getUser();
    this.googleId = this.authService.profile;
    this.isLoggedIn = this.userService.getToken();
    let i = window.location.href.indexOf('code');
    if (this.isLoggedIn == null && i != -1) {
      this.userService.retrieveToken(window.location.href.substring(i + 5));
    }
  }
}
