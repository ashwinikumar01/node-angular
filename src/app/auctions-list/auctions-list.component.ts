import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'auctions-list',
  templateUrl: './auctions-list.component.html',
  styleUrls: ['./auctions-list.component.sass'],
})
export class AuctionsListComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userId: string;
  private authStatusSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
