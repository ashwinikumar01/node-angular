import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/auctions';

@Injectable({
  providedIn: 'root',
})
export class AuctionsService {
  constructor(private http: HttpClient, private router: Router) {}

  getAuctionsList() {
    this.http.get<{message: string, auctionItemsList:any}>(BACKEND_URL).pipe()
  }
}
