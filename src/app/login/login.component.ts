import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { NotifierService } from 'angular-notifier' 
import { LoaderService } from '../services/loader.service';

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
    private notifierService: NotifierService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.loginExistingUser('jonnyX', 'jonnyX')
    // }, 3000)
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
    this.loaderService.startLoading();
    this.authService.login(username, password)
      .subscribe({
        next: (resp: { token: string, expiration: any, username: string, role: string }) => {
          this.loaderService.stopLoading();
          if (resp.token.length > 0) {
            this.dialogRef.close();
            this.notifierService.notify('default', `Welcome, ${resp.username}!`)
            this.authService.setSession(resp)
          } else {
            this.notifierService.notify('default', 'failed to authenticate')
          }
        }
      })
  }

  loginNewUser(username: string, password: string): void {
    this.loaderService.startLoading();
    this.authService.signup(username, password)
      .subscribe({
        next: (resp: { token: string, expiration: string, username: string, role: string }) => {
          this.loaderService.stopLoading();
          if (resp.token.length > 0) {
            this.dialogRef.close();
            this.notifierService.notify('default', `Welcome, ${resp.username}!`);
            this.authService.setSession(resp);
          } else {
            this.notifierService.notify('default', 'failed to authenticate')
          }
        }
      })
  }

  toggleNewUser() {
    this.userForm.reset();
    this.newUser = !this.newUser;
  }

}
