import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public hide = true;
  isLoading = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.userLogin(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
