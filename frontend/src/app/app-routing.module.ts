import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './page/main/main.component';
import { RegisterComponent } from './page/register/register.component';
import { BuyPageComponent } from './page/buy-page/buy-page.component';
import { MyLoyComponent } from './page/my-loy/my-loy.component';
import { LoginComponent } from './page/login/login.component';
import { BuyHtrComponent } from './page/buy-htr/buy-htr.component';
import { AdminDashComponent } from './page/admin-dash/admin-dash.component';
import { MyLotteryComponent } from './page/my-lottery/my-lottery.component';
import { MnUserComponent } from './page/admin-dash/mn-user/mn-user.component';
import { MnBuyComponent } from './page/admin-dash/mn-buy/mn-buy.component';

const routes: Routes = [
  {path : '', component : MainComponent},
  {path : 'register', component : RegisterComponent},
  {path : 'to-buy', component : BuyPageComponent},
  {path : 'buy-detail/:p1', component : MyLoyComponent},
  {path : 'login', component : LoginComponent},
  {path : 'buy-his', component : BuyHtrComponent},
  {path : 'admin-dash', component : AdminDashComponent},
  {path : 'my-lot', component : MyLotteryComponent},
  // {path : 'mn-user', component : MnUserComponent},
  {path : 'mn-buy', component : MnBuyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
