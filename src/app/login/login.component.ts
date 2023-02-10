import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { NotifierService } from 'angular-notifier' 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  public hide = true;
  public userForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })
  public newUser!: boolean;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
      this.newUser = false;
  }

  onLogin(): void {
    if (this.userForm.valid) {
      if (typeof this.userForm.value.username == 'string' && typeof this.userForm.value.password == 'string') {
        if (this.newUser) {
          this.loginNewUser(this.userForm.value.username, this.userForm.value.password);
        } else {
          this.loginExistingUser(this.userForm.value.username, this.userForm.value.password);
        }
      }
    }
  }

  loginExistingUser(username: string, password: string): void {
    this.authService.login(username, password)
      .subscribe({
        next: (resp: { token: string, expiration: string, username: string, role: string }) => {
          if (resp.token.length > 0) {
            this.dialogRef.close();
            this.notifierService.notify('default', `Welcome, ${resp.username}!`)
            this.authService.setSession(resp)
          } else {
            this.notifierService.notify('default', 'failed to authenticate')
          }
        },
        error: () => {
          this.notifierService.notify('default', 'username or password is incorrect')
        }
      })
  }

  loginNewUser(username: string, password: string): void {
    this.authService.signup(username, password)
      .subscribe({
        next: (resp: { token: string, expiration: string, username: string, role: string }) => {
          if (resp.token.length > 0) {
            this.dialogRef.close();
            this.notifierService.notify('default', `Welcome, ${resp.username}!`);
            this.authService.setSession(resp);
          } else {
            this.notifierService.notify('default', 'failed to authenticate')
          }
        },
        error: () => {
          this.notifierService.notify('default', 'failed to create account');
        }
      })
  }

  toggleNewUser() {
    this.userForm.reset();
    this.newUser = !this.newUser;
  }

}
