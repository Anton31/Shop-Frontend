import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TypeListComponent} from './types/type-list/type-list.component';
import {BrandListComponent} from './brands/brand-list/brand-list.component';
import {RouterModule} from "@angular/router";
import {ProductListComponent} from './products/product-list/product-list.component';
import {MatMenuModule} from "@angular/material/menu";
import {ListOrdersComponent} from './orders/list-orders/list-orders.component';
import {authInterceptor} from "./service/auth-interceptor";
import {GetProductComponent} from "./products/get-product/get-product.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {OAuthModule} from "angular-oauth2-oidc";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    RouterModule.forRoot([
      {path: 'product/:id', component: GetProductComponent},
      {path: '', component: ProductListComponent, title: 'products'},
      {path: 'types', component: TypeListComponent, title: 'types'},
      {path: 'brands', component: BrandListComponent, title: 'brands'},
      {path: 'checkout', component: CheckoutComponent, title: 'checkout'},
      {path: 'orders', component: ListOrdersComponent, title: 'orders'},
      {path: '**', component: NotFoundComponent}]),
    OAuthModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
export class AppModule {
}
