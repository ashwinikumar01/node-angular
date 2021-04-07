import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auction } from './auction.model';

const BACKEND_URL = environment.apiUrl + '/auctions/';
@Injectable({
  providedIn: 'root',
})
export class AuctionsService {
  private auctionsModel: Auction[] = [];
  private auctionsUpdated = new Subject<{}>();

  constructor(private http: HttpClient, private router: Router) {}

  getAuctionsList() {
    this.http
      .get<{ message: string; auctionItemsList: any }>(BACKEND_URL)
      .pipe();
  }

  deleteAuctionItem(auctionItemId: string) {
    return this.http.delete(BACKEND_URL + auctionItemId).subscribe(() => {
      const updatedAuctionItemList = this.auctionsModel.filter(
        (auctionModelItem) => auctionModelItem.id !== auctionItemId
      );
      this.auctionsModel = updatedAuctionItemList;
    });
  }
}
