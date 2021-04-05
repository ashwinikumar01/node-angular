import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionsListComponent } from './auctions-list/auctions-list.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: AuctionsListComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'auctions-list',
    component: AuctionsListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
