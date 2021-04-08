import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionsListComponent } from './auctions-list/auctions-list.component';
import { CreateNewItemComponent } from './auctions-list/create-new-item/create-new-item.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoggedInGuard } from './loggedIn.guard';

const routes: Routes = [
  { path: '', component: AuctionsListComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  {
    path: 'auctions-list',
    component: AuctionsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    component: CreateNewItemComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:auctionId',
    component: CreateNewItemComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LoggedInGuard],
})
export class AppRoutingModule {}
