import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from 'src/app/login/login.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  loggedIn = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  openLogin(): void {
    this.dialog.open(LoginComponent, {
      width: '400px',
      minHeight: '300px',
      position: {top: '10vh'}
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home'])
  }
}
