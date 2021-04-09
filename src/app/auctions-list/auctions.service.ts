import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Auction } from './auction.model';

const BACKEND_URL = environment.apiUrl + '/auctions';
@Injectable({
  providedIn: 'root',
})
export class AuctionsService {
  private auctionsModelItems: Auction[] = [];
  private auctionsUpdated = new Subject<Auction[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getAllAuctionsList() {
    this.http
      .get<{ message: string; auctionItemsList: any }>(BACKEND_URL)
      .pipe(
        map((auctionData) => {
          return auctionData.auctionItemsList.map((auction) => {
            return {
              id: auction._id,
              auctionItemTitle: auction.auctionItemTitle,
              auctionItemContent: auction.auctionItemContent,
              auctionItemImagePath: auction.auctionItemImagePath,
              auctionItemPrice: auction.auctionItemPrice,
            };
          });
        })
      )
      .subscribe((transformedAuctionLists) => {
        this.auctionsModelItems = transformedAuctionLists;
        this.auctionsUpdated.next([...this.auctionsModelItems]);
      });
  }

  getSingleAuctionItem(auctionSingleItemId: string) {
    return this.http.get<{
      _id: string; // getting from MongoDB
      auctionItemTitle: string;
      auctionItemContent: string;
      auctionItemImagePath: string;
      auctionItemPrice: any;
    }>(BACKEND_URL + '/' + auctionSingleItemId);
  }

  getAuctionUpdateListener() {
    return this.auctionsUpdated.asObservable();
  }

  addAuctionItem(
    auctionItemTitle: string,
    auctionItemContent: string,
    auctionItemImagePath: File,
    auctionItemPrice: any
  ) {
    const auctionData = new FormData();
    auctionData.append('auctionItemTitle', auctionItemTitle);
    auctionData.append('auctionItemContent', auctionItemContent);
    auctionData.append(
      'auctionItemImagePath',
      auctionItemImagePath,
      auctionItemTitle
    );
    auctionData.append('auctionItemPrice', auctionItemPrice);
    this.http
      .post<{ message: string; auctionItemList: Auction }>(
        BACKEND_URL,
        auctionData
      )
      .subscribe((responseData) => {
        const auction: Auction = {
          id: responseData.auctionItemList.id,
          auctionItemTitle: auctionItemTitle,
          auctionItemContent: auctionItemContent,
          auctionItemImagePath:
            responseData.auctionItemList.auctionItemImagePath,
          auctionItemPrice: auctionItemPrice,
        };
        this.auctionsModelItems.push(auction);
        this.auctionsUpdated.next([...this.auctionsModelItems]);
        this.router.navigate(['/auctions-list']);
        console.log(responseData);
      });
  }

  updateAuctionItem(
    id: string,
    auctionItemTitle: string,
    auctionItemContent: string,
    auctionItemImagePath: File | string,
    auctionItemPrice: any
  ) {
    let auctionData: Auction | FormData;
    if (typeof auctionItemImagePath === 'object') {
      auctionData = new FormData();
      auctionData.append('id', id);
      auctionData.append('auctionItemTitle', auctionItemTitle);
      auctionData.append('auctionItemContent', auctionItemContent);
      auctionData.append(
        'auctionItemImagePath',
        auctionItemImagePath,
        auctionItemTitle
      );
      auctionData.append('auctionItemPrice', auctionItemPrice);
    } else {
      auctionData = {
        id: id,
        auctionItemTitle: auctionItemTitle,
        auctionItemContent: auctionItemContent,
        auctionItemImagePath: auctionItemImagePath,
        auctionItemPrice: auctionItemPrice,
      };
    }
    this.http.put(BACKEND_URL + '/' + id, auctionData).subscribe((response) => {
      const updatedAuctionList = [...this.auctionsModelItems];
      const oldAuctionIndex = updatedAuctionList.findIndex((a) => a.id === id);
      const auction: Auction = {
        id: id,
        auctionItemTitle: auctionItemTitle,
        auctionItemContent: auctionItemContent,
        auctionItemImagePath: '',
        auctionItemPrice: auctionItemPrice,
      };
      updatedAuctionList[oldAuctionIndex] = auction;
      this.auctionsModelItems = updatedAuctionList;
      this.auctionsUpdated.next([...this.auctionsModelItems]);
      console.log(response);
      this.router.navigate(['/auctions-list']);
    });
  }

  deleteAuctionItem(auctionItemId: string) {
    return this.http.delete(BACKEND_URL + '/' + auctionItemId);
    // .subscribe(() => {
    //   // we wanted to keep only this list
    //   const updatedAuctionItemList = this.auctionsModelItems.filter(
    //     (auctionModelItem) => auctionModelItem.id !== auctionItemId
    //   );
    //   this.auctionsModelItems = updatedAuctionItemList;
    //   this.auctionsUpdated.next([...this.auctionsModelItems]);
    // });
  }
}
