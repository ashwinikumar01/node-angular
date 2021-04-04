import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthModel } from './auth_model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string, userDetails: string) {
    const authData: AuthModel = {
      email: email,
      password: password,
      userDetails: userDetails,
    };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }
}
