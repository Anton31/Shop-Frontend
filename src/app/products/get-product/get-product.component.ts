import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../service/product-service";
import {Product} from "../../model/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-get-product',
  standalone: false,
  templateUrl: './get-product.component.html',
  styleUrl: './get-product.component.css'
})
export class GetProductComponent {
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    items: 2,
    nav: true
  }
  product!: Product;
  productId: string | null = null;
  title = '';

  constructor(private productService: ProductService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
    this.productService.getProduct(Number(this.productId)).subscribe(data => {
      this.product = data;
      this.title = data.name;
    });
  }
}
