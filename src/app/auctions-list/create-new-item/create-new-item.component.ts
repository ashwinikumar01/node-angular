import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Auction } from '../auction.model';
import { AuctionsService } from '../auctions.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-create-new-item',
  templateUrl: './create-new-item.component.html',
  styleUrls: ['./create-new-item.component.scss'],
})
export class CreateNewItemComponent implements OnInit, OnDestroy {
  private mode = 'create';
  private auctionId: string;
  auction: Auction;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    private auctionService: AuctionsService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      auctionItemTitle: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      auctionItemContent: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      auctionItemPrice: new FormControl(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('auctionId')) {
        this.mode = 'edit';
        this.auctionId = paramMap.get('auctionId');
        this.isLoading = true;
        this.auctionService
          .getSingleAuctionItem(this.auctionId)
          .subscribe((auctionData) => {
            this.isLoading = false;
            this.auction = {
              id: auctionData._id,
              auctionItemTitle: auctionData.auctionItemTitle,
              auctionItemContent: auctionData.auctionItemContent,
              auctionItemImagePath: auctionData.auctionItemImagePath,
              auctionItemPrice: auctionData.auctionItemPrice,
            };
            this.form.setValue({
              auctionItemTitle: this.auction.auctionItemTitle,
              auctionItemContent: this.auction.auctionItemContent,
              image: this.auction.auctionItemImagePath,
              auctionItemPrice: this.auction.auctionItemPrice,
            });
          });
      } else {
        this.mode = 'create';
        this.auctionId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveAuction() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.auctionService.addAuctionItem(
        this.form.value.auctionItemTitle,
        this.form.value.auctionItemContent,
        this.form.value.image,
        this.form.value.auctionItemPrice
      );
    } else {
      this.auctionService.updateAuctionItem(
        this.auctionId,
        this.form.value.auctionItemTitle,
        this.form.value.auctionItemContent,
        this.form.value.image,
        this.form.value.auctionItemPrice
      );
    }

    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
