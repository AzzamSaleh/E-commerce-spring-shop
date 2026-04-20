import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login-status.html',
  styleUrl: './login-status.css'
})
export class LoginStatus implements OnInit {
  isAuthenticated = false;
  userEmail?: string;
  storage: Storage = sessionStorage;

  constructor(
    private auth: AuthService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
      console.log('User is authenticated:', this.isAuthenticated);
    });

    this.auth.user$.subscribe((user) => {
      this.userEmail = user?.email;
      if (this.userEmail) {
        this.storage.setItem('userEmail', this.userEmail);
      }
      console.log('User email:', this.userEmail);
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams: {
        returnTo: this.doc.location.origin
      }
    });
  }
}