import {GetProductComponent} from "./products/get-product/get-product.component";
import {ProductListComponent} from "./products/product-list/product-list.component";
import {TypeListComponent} from "./types/type-list/type-list.component";
import {BrandListComponent} from "./brands/brand-list/brand-list.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {ListOrdersComponent} from "./orders/list-orders/list-orders.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {Routes} from "@angular/router";

export const routes: Routes = [
  {path: 'product/:id', component: GetProductComponent},
  {path: '', component: ProductListComponent, title: 'products'},
  {path: 'types', component: TypeListComponent, title: 'types'},
  {path: 'brands', component: BrandListComponent, title: 'brands'},
  {path: 'checkout', component: CheckoutComponent, title: 'checkout'},
  {path: 'orders', component: ListOrdersComponent, title: 'orders'},
  {path: '**', component: NotFoundComponent}
];
