import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {RegisterComponent} from './register/register.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TypeListComponent} from './types/type-list/type-list.component';
import {BrandListComponent} from './brands/brand-list/brand-list.component';
import {RouterModule} from "@angular/router";
import {ProductListComponent} from './products/product-list/product-list.component';
import {NgOptimizedImage} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {ListOrdersComponent} from './orders/list-orders/list-orders.component';
import {MatBadgeModule} from "@angular/material/badge";
import {authInterceptor} from "./service/auth-interceptor";
import {CarouselModule} from "ngx-owl-carousel-o";
import {GetProductComponent} from "./products/get-product/get-product.component";
import {MatRadioModule} from "@angular/material/radio";
import {NotFoundComponent} from "./not-found/not-found.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {OAuthModule} from "angular-oauth2-oidc";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent,
    GetProductComponent,
    RegisterComponent,
    ListOrdersComponent,
    NotFoundComponent
  ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    RouterModule.forRoot([
      {path: 'product/:id', component: GetProductComponent},
      {path: '', component: ProductListComponent, title: 'products'},
      {path: 'types', component: TypeListComponent, title: 'types'},
      {path: 'brands', component: BrandListComponent, title: 'brands'},
      {path: 'checkout', component: CheckoutComponent, title: 'checkout'},
      {path: 'orders', component: ListOrdersComponent, title: 'orders'},
      {path: '**', component: NotFoundComponent}
    ]),
    OAuthModule.forRoot(),
    ReactiveFormsModule,
    MatRadioModule,
    CarouselModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    NgOptimizedImage,
    MatMenuModule,
    MatBadgeModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
export class AppModule {
}
