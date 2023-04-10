import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private notifierService: NotifierService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  public handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.status === 401 && error.url?.includes('auth/login')) {
      errorMessage = 'Username and/or password are incorrect';
    } else if (error.status === 403 && localStorage.getItem('token_id')) {
      errorMessage = 'Your session is expired';
      this.openLogin();
      this.router.navigate(['/home']);
    } else if (error.status === 403) {
      errorMessage = 'Nice try pal, you are not authorized';
      this.router.navigate(['/home']);
    } else {
      errorMessage = 'Gosh darn something went wrong, try again later'
    }
    this.notifierService.notify('default', errorMessage);
  }


  public openLogin(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'},
      data: {}
    });
  }
}
