import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AddProductComponent} from './products/add-product/add-product.component';
import {MatSelectModule} from "@angular/material/select";
import {DeleteProductComponent} from './products/delete-product/delete-product.component';
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {RegisterComponent} from './register/register.component';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AddTypeComponent} from './types/add-type/add-type.component';
import {AddBrandComponent} from './brands/add-brand/add-brand.component';
import {TypeListComponent} from './types/type-list/type-list.component';
import {BrandListComponent} from './brands/brand-list/brand-list.component';
import {RouterModule} from "@angular/router";
import {ProductListComponent} from './products/product-list/product-list.component';
import {DeleteTypeComponent} from './types/delete-type/delete-type.component';
import {DeleteBrandComponent} from './brands/delete-brand/delete-brand.component';
import {NgOptimizedImage} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {CartComponent} from './cart/cart.component';
import {DeletePhotosComponent} from './photos/delete-photos/delete-photos.component';
import {ListOrdersComponent} from './orders/list-orders/list-orders.component';
import {MatBadgeModule} from "@angular/material/badge";
import {CheckoutComponent} from './checkout/checkout.component';
import {authInterceptor} from "./service/auth-interceptor";
import {OAuthModule} from "angular-oauth2-oidc";
import {DeletePhotoComponent} from "./photos/delete-photo/delete-photo.component";
import {CarouselModule} from "ngx-owl-carousel-o";
import {AddPhotosComponent} from "./photos/add-photos/add-photos.component";
import {GetProductComponent} from "./products/get-product/get-product.component";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  declarations: [
    AppComponent,
    GetProductComponent,
    AddProductComponent,
    AddPhotosComponent,
    DeleteProductComponent,
    RegisterComponent,
    AddTypeComponent,
    AddBrandComponent,
    TypeListComponent,
    BrandListComponent,
    ProductListComponent,
    DeleteTypeComponent,
    DeleteBrandComponent,
    CartComponent,
    DeletePhotosComponent,
    ListOrdersComponent,
    CheckoutComponent,
    DeletePhotoComponent,
  ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    RouterModule.forRoot([

      {path: '', component: ProductListComponent, pathMatch: "full"},
      {path: 'types', component: TypeListComponent},
      {path: 'brands', component: BrandListComponent},
      {path: 'checkout', component: CheckoutComponent},
      {path: 'orders', component: ListOrdersComponent},
      {path: 'product/:id', component: GetProductComponent},
    ]),
    OAuthModule.forRoot(),
    ReactiveFormsModule,
    MatRadioModule,
    CarouselModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    NgOptimizedImage,
    MatMenuModule,
    MatBadgeModule,
    RouterModule],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
})
export class AppModule {
}
