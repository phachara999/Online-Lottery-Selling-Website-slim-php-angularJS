import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './page/main/main.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterComponent } from './page/register/register.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MyLoyComponent } from './page/my-loy/my-loy.component';
import { LoginComponent } from './page/login/login.component';
import { BuyPageComponent } from './page/buy-page/buy-page.component';
import { BuyHtrComponent } from './page/buy-htr/buy-htr.component';
import { AdminDashComponent } from './page/admin-dash/admin-dash.component';
import { MyLotteryComponent } from './page/my-lottery/my-lottery.component';
import { NewlotComponent } from './page/admin-dash/newlot/newlot.component';
import { MnBuyComponent } from './page/admin-dash/mn-buy/mn-buy.component';
import { MnUserComponent } from './page/admin-dash/mn-user/mn-user.component';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RegisterComponent,
    MyLoyComponent,
    LoginComponent,
    BuyPageComponent,
    BuyHtrComponent,
    AdminDashComponent,
    MyLotteryComponent,
    NewlotComponent,
    MnBuyComponent,
    MnUserComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatListModule,
    MatDialogModule,
    MatToolbarModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
