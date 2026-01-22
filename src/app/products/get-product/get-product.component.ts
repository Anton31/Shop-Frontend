import {Component, signal} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductService} from "../../service/product-service";
import {Product} from "../../model/product";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {map, Observable} from "rxjs";
import {AddPhotosComponent} from "../../photos/add-photos/add-photos.component";
import {DeletePhotosComponent} from "../../photos/delete-photos/delete-photos.component";
import {DeletePhotoComponent} from "../../photos/delete-photo/delete-photo.component";
import {Photo} from "../../model/photo";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../service/user-service";

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
    nav: true
  }
  items = signal([1, 2, 3]);
  product!: Product;
  title = '';
  photoForm!: FormGroup;
  isAdmin!: Observable<boolean>;
  productId = signal(0);

  constructor(private productService: ProductService,
              private userService: UserService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {
    this.userService.getUser();
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(Number(params['id']));
      this.getProducts(this.productId());
    });
  }

  getProducts(id: number) {
    this.productService.getProduct(id).subscribe(data => {
      this.product = data;
    });
  }

  addPhotos(product: Product) {
    this.photoForm = this.fb.group({
      productId: [product.id],
      photos: [null]
    });
    this.dialog.open(AddPhotosComponent, {
      height: '500px',
      width: '500px',
      data: {
        photoForm: this.photoForm,
        product: product
      }
    }).afterClosed().subscribe(data => {
      this.productService.addPhotos(data).subscribe(data => {
        this.getProducts(data);
      })
    })
  }

  deletePhotos(product: Product) {
    this.dialog.open(DeletePhotosComponent, {
      height: '500px',
      width: '500px',
      data: {
        product: product
      }
    }).afterClosed().subscribe(data => {
      this.productService.deletePhotos(data).subscribe(data => {
        this.getProducts(data);
      });
    });
  }

  deletePhoto(product: Product, photo: Photo) {
    this.dialog.open(DeletePhotoComponent, {
      height: '500px',
      width: '500px',
      data: {
        photo: photo
      }
    }).afterClosed().subscribe(data => {
      this.productService.deletePhoto(product.id, data.id).subscribe(data => {
        this.getProducts(data);
      });
    });
  }

  setItems(value: number) {
    this.customOptions = {
      items: value,
      loop: true,
      autoplay: true,
      nav: true
    }
  }
}


