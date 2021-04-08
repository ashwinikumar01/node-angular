import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Auction } from './auction.model';
import { AuctionsService } from './auctions.service';

@Component({
  selector: 'auctions-list',
  templateUrl: './auctions-list.component.html',
  styleUrls: ['./auctions-list.component.scss'],
})
export class AuctionsListComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userId: string;
  private authStatusSubs: Subscription;
  auctions: Auction[] = [];
  private auctionsSub: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private auctionService: AuctionsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.auctionService.getAllAuctionsList();
    this.userId = this.authService.getUserId();
    this.auctionsSub = this.auctionService
      .getAuctionUpdateListener()
      .subscribe((auctions: Auction[]) => {
        this.isLoading = false;
        this.auctions = auctions;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(auctionItemId: string) {
    this.isLoading = true;
    this.auctionService.deleteAuctionItem(auctionItemId).subscribe(
      () => {
        this.auctionService.getAllAuctionsList();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.auctionsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
